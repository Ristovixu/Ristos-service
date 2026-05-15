import { PrismaClient, Order, OrderStatus, MessengerType } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';
import { Twilio } from 'twilio';

const prisma = new PrismaClient();

const STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED:    'Принят',
  DIAGNOSTICS: 'Диагностика',
  APPROVAL:    'Ожидает согласования',
  IN_REPAIR:   'В ремонте',
  READY:       'Готов к выдаче',
  ISSUED:      'Выдан',
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  RECEIVED:    'Мы получили ваше устройство и скоро приступим к работе.',
  DIAGNOSTICS: 'Мастер проводит диагностику вашего устройства.',
  APPROVAL:    'Диагностика завершена. Ожидаем вашего подтверждения на ремонт.',
  IN_REPAIR:   'Мастер приступил к ремонту вашего устройства.',
  READY:       '🎉 Ремонт завершён! Устройство готово к выдаче.',
  ISSUED:      'Устройство выдано. Спасибо, что выбрали нас!',
};

class NotificationService {
  private telegramBot?: TelegramBot;
  private twilioClient?: Twilio;

  constructor() {
    if (process.env.TELEGRAM_BOT_TOKEN) {
      this.telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
      this.initBotListeners();
    }
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
  }

  private initBotListeners() {
    if (!this.telegramBot) return;

    this.telegramBot.onText(/\/start (.+)/, async (msg, match) => {
      const chatId = msg.chat.id.toString();
      const token = match?.[1];

      if (token && token.startsWith('auth_')) {
        try {
          const session = await prisma.telegramSession.findUnique({
            where: { token }
          });

          if (session && session.status === 'PENDING' && session.expiresAt > new Date()) {
            await prisma.telegramSession.update({
              where: { id: session.id },
              data: { 
                status: 'AUTHORIZED',
                chatId: chatId
              }
            });

            // Find or create client
            let client = await prisma.client.findFirst({
              where: { telegramId: chatId }
            });

            if (!client) {
              client = await prisma.client.create({
                data: {
                  phone: `TG-${chatId}`,
                  telegramId: chatId,
                }
              });
            }

            this.telegramBot?.sendMessage(chatId, '✅ Вы успешно авторизованы на сайте! Можете возвращаться в браузер.');

            if (!client.phone || client.phone.startsWith('TG-')) {
              this.telegramBot?.sendMessage(chatId, '🛠 Для полноценной работы, пожалуйста, подтвердите ваш номер телефона, нажав кнопку ниже:', {
                reply_markup: {
                  keyboard: [[{ text: '📱 Отправить номер телефона', request_contact: true }]],
                  one_time_keyboard: true,
                  resize_keyboard: true
                }
              });
            }
          } else if (session && session.status === 'AUTHORIZED') {
            this.telegramBot?.sendMessage(chatId, '👌 Вы уже успешно авторизованы по этой ссылке. Приятной работы!');
          } else {
            this.telegramBot?.sendMessage(chatId, '❌ Ссылка устарела или недействительна.');
          }
        } catch (err) {
          console.error('Bot auth error:', err);
        }
      }
    });

    this.telegramBot.on('contact', async (msg) => {
      const chatId = msg.chat.id.toString();
      const phone = msg.contact?.phone_number;

      if (phone) {
        // Clean phone: remove + and spaces
        const cleanPhone = phone.replace(/\D/g, '');
        try {
          await prisma.client.update({
            where: { telegramId: chatId },
            data: { phone: cleanPhone }
          });
          this.telegramBot?.sendMessage(chatId, '✨ Номер успешно подтверждён! Теперь вы будете получать уведомления о статусе ваших заказов прямо здесь.', {
            reply_markup: { remove_keyboard: true }
          });
        } catch (err) {
          console.error('Update phone error:', err);
        }
      }
    });

    this.telegramBot.onText(/\/start$/, (msg) => {
      this.telegramBot?.sendMessage(msg.chat.id, 'Добро пожаловать в техподдержку ТехРемонт! 🛠\n\nЧтобы войти в личный кабинет на сайте, нажмите кнопку «Войти через Telegram» на странице входа.');
    });
  }

  async notifyAdminNewOrder(order: Order): Promise<void> {
    const adminChatId = process.env.ADMIN_TELEGRAM_ID;
    if (!adminChatId) return;

    // Helper to escape HTML special characters
    const escape = (str: string | null) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    const message = `🆕 <b>Новая заявка #${order.orderNumber}</b>\n\n` +
                   `📱 Клиент: ${escape(order.clientName)}\n` +
                   `📞 Телефон: <code>${escape(order.clientPhone)}</code>\n` +
                   `🛠 Устройство: ${escape(order.deviceType)} ${escape(order.deviceModel)}\n` +
                   `❓ Проблема: ${escape(order.problemDesc)}`;

    if (this.telegramBot) {
      await this.telegramBot.sendMessage(adminChatId, message, {
        parse_mode: 'HTML'
      });
    }
  }

  async notifyStatusChange(order: Order, newStatus: OrderStatus): Promise<void> {
    const message = this.buildMessage(order, newStatus);
    const channel = order.messengerType;

    try {
      let success = false;
      let error = '';
      let targetTelegramId = order.messengerContact;

      // If linked to a client, try to get their real telegramId (chatId)
      if (order.clientId) {
        const client = await prisma.client.findUnique({
          where: { id: order.clientId },
          select: { telegramId: true }
        });
        if (client?.telegramId) {
          targetTelegramId = client.telegramId;
        }
      }

      if (channel === 'TELEGRAM' && targetTelegramId && /^\d+$/.test(targetTelegramId)) {
        success = await this.sendTelegram(targetTelegramId, message);
      } else if (channel === 'WHATSAPP' && order.messengerContact) {
        success = await this.sendWhatsApp(order.messengerContact, message, order.orderNumber, newStatus);
      }

      // Fallback to SMS if messenger failed or was not specified
      if (!success) {
        success = await this.sendSms(order.clientPhone, `Заказ #${order.orderNumber}: статус "${STATUS_LABELS[newStatus]}". Подробнее: ${process.env.SITE_URL}/status?order=${order.orderNumber}&phone=${order.clientPhone}`);
      }

      // Log notification
      await prisma.notificationLog.create({
        data: {
          orderId: order.id,
          channel: success ? channel : 'NONE',
          status: success ? 'sent' : 'failed',
          error: success ? null : (error || 'Failed to send or no valid channel'),
        },
      });

    } catch (err: any) {
      console.error('Notification error:', err);
      await prisma.notificationLog.create({
        data: {
          orderId: order.id,
          channel,
          status: 'failed',
          error: err.message,
        },
      });
    }
  }

  private buildMessage(order: Order, status: OrderStatus): string {
    const escape = (str: string | null) => (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const siteUrl = process.env.SITE_URL || 'http://localhost:5173';
    
    return `🔧 <b>Обновление по заказу #${order.orderNumber}</b>\n\n` +
           `Устройство: ${escape(order.deviceType)} ${escape(order.deviceModel)}\n` +
           `Новый статус: <b>${STATUS_LABELS[status]}</b>\n\n` +
           `${STATUS_DESCRIPTIONS[status]}\n\n` +
           `🔗 Отследить заказ: ${siteUrl}/status?order=${order.orderNumber}&phone=${order.clientPhone}`;
  }

  private async sendTelegram(chatId: string, text: string): Promise<boolean> {
    if (!this.telegramBot) {
      console.log(`[MOCK TELEGRAM] to ${chatId}: ${text}`);
      return true;
    }
    try {
      await this.telegramBot.sendMessage(chatId, text, { parse_mode: 'HTML' });
      return true;
    } catch (e) {
      console.error(`[Notification] Error sending to ${chatId}:`, e);
      return false;
    }
  }

  private async sendWhatsApp(phone: string, text: string, orderNumber: string, status: OrderStatus): Promise<boolean> {
    if (!this.twilioClient) {
      console.log(`[MOCK WHATSAPP] to ${phone}: ${text}`);
      return true;
    }
    try {
      await this.twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
        to: `whatsapp:${phone}`,
        body: text,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  private async sendSms(phone: string, text: string): Promise<boolean> {
    if (!this.twilioClient && !process.env.SMSRU_API_KEY) {
      console.log(`[MOCK SMS] to ${phone}: ${text}`);
      return true;
    }
    
    // SMS.ru implementation example
    if (process.env.SMSRU_API_KEY) {
        console.log(`[MOCK SMS.RU] to ${phone}: ${text}`);
        return true;
    }

    try {
      await this.twilioClient!.messages.create({
        from: process.env.TWILIO_SMS_FROM,
        to: phone,
        body: text,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const notificationService = new NotificationService();
