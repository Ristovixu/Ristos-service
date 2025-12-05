import { corsHeaders } from '../_shared/cors.ts';

interface RepairRequest {
  name: string;
  phone: string;
  device_type?: string;
  problem?: string;
}

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram credentials not configured');
    }

    const repairRequest: RepairRequest = await req.json();

    // Формируем сообщение для Telegram
    const deviceTypeText = repairRequest.device_type 
      ? getDeviceTypeText(repairRequest.device_type)
      : 'Не указан';

    const message = `🔧 *Новая заявка на ремонт!*

👤 *Клиент:* ${repairRequest.name}
📱 *Телефон:* ${repairRequest.phone}
💻 *Устройство:* ${deviceTypeText}
${repairRequest.problem ? `📝 *Проблема:* ${repairRequest.problem}` : ''}

⏰ *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

Свяжитесь с клиентом как можно скорее!`;

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      const errorData = await telegramResponse.json();
      throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function getDeviceTypeText(deviceType: string): string {
  const deviceTypes: Record<string, string> = {
    'smartphone': '📱 Смартфон',
    'tv': '📺 Телевизор',
    'laptop': '💻 Ноутбук',
    'pc': '🖥️ Компьютер',
    'other': '🔧 Другое устройство'
  };
  
  return deviceTypes[deviceType] || deviceType;
}