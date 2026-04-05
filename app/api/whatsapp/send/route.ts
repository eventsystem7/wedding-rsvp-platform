import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400 }
      );
    }

    // Verify event belongs to user
    const event = await prisma.event.findFirst({
      where: { id: parseInt(eventId), userId: decoded.userId },
      include: { guests: true }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Send WhatsApp messages to all pending guests
    const results = await Promise.all(
      event.guests
        .filter(g => g.status === 'pending')
        .map(async (guest) => {
          try {
            const result = await sendWhatsAppMessage(
              guest.phone,
              guest.name,
              event.groomName,
              event.brideName,
              event.id
            );

            if (result.success) {
              await prisma.guest.update({
                where: { id: guest.id },
                data: { sentAt: new Date() }
              });
            }

            return { guestId: guest.id, success: result.success };
          } catch (err) {
            return { guestId: guest.id, success: false, error: err };
          }
        })
    );

    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      message: `Sent ${successful} messages, ${failed} failed`,
      results
    });
  } catch (error) {
    console.error('Send WhatsApp error:', error);
    return NextResponse.json(
      { error: 'Failed to send messages' },
      { status: 500 }
    );
  }
}
