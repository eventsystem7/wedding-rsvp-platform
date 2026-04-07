import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    // Fetch all events with guest counts
    const events = await prisma.event.findMany({
      include: {
        guests: true,
      },
    });

    const eventsWithCounts = events.map((event) => ({
      id: event.id,
      groomName: event.groomName,
      brideName: event.brideName,
      eventDate: event.eventDate,
      eventLocation: event.eventLocation,
      userId: event.userId,
      guestCount: event.guests.length,
      confirmedCount: event.guests.filter((g) => g.status === 'confirmed').length,
    }));

    return NextResponse.json(eventsWithCounts);
  } catch (error) {
    console.error('Admin events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
