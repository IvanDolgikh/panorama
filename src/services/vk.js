export const sendVkNotification = async (messageText) => {
    try {
        const token = import.meta.env.VITE_VK_BOT_TOKEN;
        const chatId = import.meta.env.VITE_VK_CHAT_ID;

        const params = new URLSearchParams({
            peer_id: chatId.trim(),
            random_id: Math.floor(Math.random() * 2147483647),
            message: messageText,
            access_token: token.trim(),
            v: '5.199'
        });

        const response = await fetch('/vk-api/method/messages.send', {
            method: 'POST',
            body: params
        });

        const data = await response.json();

        if (data.response) {
            return data.response;
        } else if (data.error) {
            console.error('VK API вернул ошибку:', data.error.error_msg, 'Код:', data.error.error_code);
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}
