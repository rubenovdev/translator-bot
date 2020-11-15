const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const TOKEN = '1457856506:AAFAz3MNayQiPc7h0Xe8ZpTYBrdnyOU4vyw'
const bot = new TelegramBot(TOKEN, { polling: true })

let iamToken
const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'
const TRANSLATE_URL =
  'https://translate.api.cloud.yandex.net/translate/v2/translate'
const IAM_TOKENS_URL = 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
const RU = 'ru'
const YANDEX_OAUTH_TOKEN = 'AgAAAAAs6XH4AATuwbCv3VlS2U8eilL83bCCoP8'
const DEFAULT_CHAT_ID = -1001438237715

function updateIamToken() {
  fetch(IAM_TOKENS_URL, {
    method: 'POST',
    body: JSON.stringify({
      yandexPassportOauthToken: YANDEX_OAUTH_TOKEN,
    }),
  })
    .then((response) => response.json())
    .then(({ iamToken: newIamToken }) => {
      iamToken = newIamToken
    })
    .catch((error) =>
      bot.sendMessage(
        DEFAULT_CHAT_ID,
        `Ошибка при получении iam-токена: ${error.name}. Описание: ${error.message}`
      )
    )
}

updateIamToken()

setInterval(() => updateIamToken(), 360000)

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

    fetch(TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${iamToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (
          responseData &&
          responseData.translations &&
          responseData.translations.length
        ) {
          bot.sendMessage(chatId, responseData.translations[0].text)
        }
      })
      .catch((error) =>
        bot.sendMessage(
          chatId,
          `Ошибка при переводе сообщения: ${error.name}. Описание: ${error.message}`
        )
      )
  }
})
