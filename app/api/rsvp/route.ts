import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const phone = searchParams.get('phone');

    if (!eventId || !phone) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const guest = await prisma.guest.findFirst({
      where: { eventId: parseInt(eventId), phone },
    });

    return NextResponse.json({
      event,
      guestStatus: guest?.status || 'pending',
    });
  } catch (error) {
    console.error('RSVP GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, phone, status } = await req.json();

    if (!eventId || !phone || !status) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Find the guest
    const guest = await prisma.guest.findFirst({
      where: { eventId: parseInt(eventId), phone },
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Update guest status
    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        status,
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'RSVP recorded',
      guest: updated,
    });
  } catch (error) {
    console.error('RSVP POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
