export default async function handler(req, res) {
    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обработка OPTIONS запроса для CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }
    
    try {
        const { message, formData } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }
        
        // Ваши данные бота
        const TELEGRAM_BOT_TOKEN = '8531497744:AAEcPNyNHFflYD7Hm25IAPkf3jPxp5vmg4M';
        const TELEGRAM_CHAT_ID = '8161048563';
        
        // Отправка в Telegram
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
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            }
        );
        
        const telegramData = await telegramResponse.json();
        
        if (telegramData.ok) {
            // Логируем успешную отправку
            console.log('✅ Сообщение отправлено в Telegram:', {
                chat_id: TELEGRAM_CHAT_ID,
                message_length: message.length,
                timestamp: new Date().toISOString()
            });
            
            return res.status(200).json({ 
                success: true, 
                message: 'Сообщение отправлено в Telegram',
                message_id: telegramData.result.message_id
            });
            
        } else {
            console.error('❌ Ошибка Telegram API:', telegramData);
            
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram API error',
                description: telegramData.description
            });
        }
        
    } catch (error) {
        console.error('❌ Ошибка сервера:', error);
        
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message
        });
    }
}