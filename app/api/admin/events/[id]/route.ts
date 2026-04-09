import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await the params promise
    const { id: eventId } = await params;

    // Fetch specific event with guests
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        guests: {
          select: {
            id: true,
            name: true,
            phone: true,
            status: true,
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      event: {
        id: event.id,
        groomName: event.groomName,
        brideName: event.brideName,
        eventDate: event.eventDate,
        location: event.eventLocation,
        guests: event.guests
      }
    });
  } catch (error) {
    console.error('Admin event detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
