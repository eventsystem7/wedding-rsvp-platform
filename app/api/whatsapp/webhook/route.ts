import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle WhatsApp webhook callback (status updates)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // WhatsApp webhook structure
    const { entry } = body;
    
    if (!entry || entry.length === 0) {
      return NextResponse.json({ received: true });
    }

    for (const evt of entry) {
      const changes = evt.changes || [];
      
      for (const change of changes) {
        const { value } = change;
        const { messages, statuses } = value;

        // Handle incoming messages (RSVP responses)
        if (messages && messages.length > 0) {
          for (const message of messages) {
            const from = message.from;
            const text = message.text?.body?.toLowerCase() || '';

            // Find guest by phone
            const guest = await prisma.guest.findFirst({
              where: { phone: from }
            });

            if (guest) {
              let status = 'pending';
              if (text.includes('yes') || text.includes('כן') || text.includes('confirm')) {
                status = 'confirmed';
              } else if (text.includes('no') || text.includes('לא') || text.includes('decline')) {
                status = 'declined';
              }

              if (status !== 'pending') {
                await prisma.guest.update({
                  where: { id: guest.id },
                  data: { 
                    status: status as 'pending' | 'confirmed' | 'declined',
                    respondedAt: new Date()
                  }
                });
              }
            }
          }
        }

        // Handle message status updates (delivery/read)
        if (statuses && statuses.length > 0) {
          for (const status of statuses) {
            const { id: messageId, status: msgStatus } = status;
            // You can log this for tracking delivery
            console.log(`Message ${messageId} status: ${msgStatus}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }
}

// Verify webhook token (WhatsApp requirement)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'your-verify-token';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
}
