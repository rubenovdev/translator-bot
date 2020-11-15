const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const TOKEN = '1457856506:AAFAz3MNayQiPc7h0Xe8ZpTYBrdnyOU4vyw'
const bot = new TelegramBot(TOKEN, { polling: true })

const PROD = 'production'
const TEST = 'development'
const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'
const TRANSLATE_URL =
  'https://translate.api.cloud.yandex.net/translate/v2/translate'
const IAM_TOKENS_URL = 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
const YANDEX_OAUTH_TOKEN = 'AgAAAAAs6XH4AATuwbCv3VlS2U8eilL83bCCoP8'
const DEFAULT_CHAT_ID = -1001438237715
const RU = 'ru'

let iamToken
let mode = PROD

function updateIamToken() {
  if (mode === TEST) {
    bot.sendMessage(
      DEFAULT_CHAT_ID,
      '- отправка запроса на получение iam-токена'
    )
  }

  fetch(IAM_TOKENS_URL, {
    method: 'POST',
    body: JSON.stringify({
      yandexPassportOauthToken: YANDEX_OAUTH_TOKEN,
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      if (mode === TEST) {
        bot.sendMessage(
          DEFAULT_CHAT_ID,
          `- ответ от сервера: ${JSON.stringify(responseData)}`
        )
      }

      iamToken = responseData.iamToken
    })
    .catch((error) => {
      bot.sendMessage(
        DEFAULT_CHAT_ID,
        `- ошибка при получении iam-токена: ${error.name}\n- описание: ${error.message}`
      )
    })
}

updateIamToken()

setInterval(() => updateIamToken(), 360000)

bot.on('message', (msg) => {
  const fromId = msg.from.id

  if (fromId === 237089463 || fromId === 301723507) {
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
        if (mode === TEST) {
          bot.sendMessage(
            chatId,
            `- ответ от сервера: ${JSON.stringify(
              responseData
            )}\n- iamToken: ${iamToken}`
          )
        }

        if (responseData && responseData.translations) {
          bot.sendMessage(chatId, responseData.translations[0].text)
        }
      })
      .catch((error) => {
        bot.sendMessage(
          chatId,
          `- ошибка при переводе сообщения: ${error.name}\n- описание: ${error.message}`
        )
      })
  }
})

bot.onText(/test/, (msg) => {
  const chatId = msg.chat.id

  if (msg.from.id !== 301723507) {
    bot.sendMessage(chatId, '- нет доступа')
    return
  }

  mode = TEST
  bot.sendMessage(chatId, '- включен режим development')
})

bot.onText(/prod/, (msg) => {
  const chatId = msg.chat.id

  if (msg.from.id !== 301723507) {
    bot.sendMessage(chatId, '- нет доступа')
    return
  }

  mode = PROD
  bot.sendMessage(chatId, '- включен режим production')
})
