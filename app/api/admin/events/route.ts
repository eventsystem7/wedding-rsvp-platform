import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ADMIN_PASSWORD = 'AeG!g3248@E!G';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    
    // בדוק אם זה admin token
    const isAdminToken = token.startsWith('admin_authenticated_');
    
    if (!isAdminToken) {
      // בדוק JWT token רגיל
      try {
        jwt.verify(token, JWT_SECRET);
      } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Fetch all events with guest counts
    const events = await prisma.event.findMany({
      include: {
        guests: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const eventsWithCounts = events.map((event) => ({
      id: event.id,
      groomName: event.groomName,
      brideName: event.brideName,
      eventDate: event.eventDate,
      location: event.eventLocation,
      createdBy: event.userId ? `User #${event.userId}` : 'Unknown',
      guests: event.guests.length,
      responses: event.guests.filter((g) => g.status === 'confirmed' || g.status === 'declined').length,
    }));

    return NextResponse.json({ events: eventsWithCounts });
  } catch (error) {
    console.error('Admin events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
