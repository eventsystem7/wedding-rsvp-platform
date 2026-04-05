import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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

    const { eventId, guests } = await req.json();

    if (!eventId || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Verify event belongs to user
    const event = await prisma.event.findFirst({
      where: { id: parseInt(eventId), userId: decoded.userId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Create guests in bulk
    const createdGuests = await Promise.all(
      guests.map((guest: any) =>
        prisma.guest.create({
          data: {
            eventId: parseInt(eventId),
            name: guest.name,
            phone: guest.phone,
            email: guest.email || null,
          },
        })
      )
    );

    return NextResponse.json({
      message: `${createdGuests.length} guests added`,
      guests: createdGuests,
    });
  } catch (error) {
    console.error('Add guests error:', error);
    return NextResponse.json(
      { error: 'Failed to add guests' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findFirst({
      where: { id: parseInt(eventId), userId: decoded.userId },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const guests = await prisma.guest.findMany({
      where: { eventId: parseInt(eventId) },
    });

    const stats = {
      total: guests.length,
      confirmed: guests.filter(g => g.status === 'confirmed').length,
      declined: guests.filter(g => g.status === 'declined').length,
      pending: guests.filter(g => g.status === 'pending').length,
    };

    return NextResponse.json({ guests, stats });
  } catch (error) {
    console.error('Get guests error:', error);
    return NextResponse.json(
      { error: 'Failed to get guests' },
      { status: 500 }
    );
  }
}
