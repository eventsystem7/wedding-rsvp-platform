import axios from 'axios';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

export async function sendWhatsAppMessage(to: string, guestName: string, groomName: string, brideName: string, eventId: number) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.error('WhatsApp credentials missing');
    return { success: false, error: 'Credentials missing' };
  }

  const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;
  
  // Clean phone number (ensure it starts with country code without +)
  const cleanPhone = to.replace(/\D/g, '');

  const rsvpLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/rsvp/${eventId}?phone=${cleanPhone}`;

  const data = {
    messaging_product: 'whatsapp',
    to: cleanPhone,
    type: 'template',
    template: {
      name: 'wedding_invitation_rsvp', // Make sure this template exists in Meta
      language: { code: 'he' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: guestName },
            { type: 'text', text: groomName },
            { type: 'text', text: brideName },
            { type: 'text', text: rsvpLink }
          ]
        }
      ]
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('WhatsApp API error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}
