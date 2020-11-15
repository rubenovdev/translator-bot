const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const TOKEN = '1457856506:AAFAz3MNayQiPc7h0Xe8ZpTYBrdnyOU4vyw'
const bot = new TelegramBot(TOKEN, { polling: true })

const IAM_TOKEN =
  't1.9euelZqLmJmLksyPlZaOzsnIyMrMmO3rnpWaiszLy46cnYuNlZLMy5GSjZHl8_ctXDsC-u9HVkFy_d3z920KOQL670dWQXL9.BUMhF_96mypda2WsdVEZ7zs6Gw4gk2cxZ0CXfUMPSx-x66-lLLM21mlFsrP_E0k79osxTWlwcyq5f0PGxqDNBg'
const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'
const URL = 'https://translate.api.cloud.yandex.net/translate/v2/translate'
const RU = 'ru'

bot.on('message', (msg) => {
  if (msg.from.id === 237089463 || msg.from.id === 301723507) {
    const { text } = msg

    if (
      text.length < 4 ||
      text.split(' ').length < 2 ||
      !text.toLowerCase().match(/[a-z]/)
    ) {
      return
    }

    const chatId = msg.chat.id

    const data = {
      folderId: FOLDER_ID,
      texts: [text],
      targetLanguageCode: RU,
    }

    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${IAM_TOKEN}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) =>
        bot.sendMessage(chatId, responseData.translations[0].text)
      )
  }
})
