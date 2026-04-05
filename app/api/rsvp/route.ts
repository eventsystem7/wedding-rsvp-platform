import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle RSVP from WhatsApp (no auth needed)
export async function POST(req: NextRequest) {
  try {
    const { guestId, status } = await req.json();

    if (!guestId || !['confirmed', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const guest = await prisma.guest.update({
      where: { id: parseInt(guestId) },
      data: {
        status,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('RSVP error:', error);
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    );
  }
}
