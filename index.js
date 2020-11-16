const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')

const TOKEN = '1457856506:AAFAz3MNayQiPc7h0Xe8ZpTYBrdnyOU4vyw'
const bot = new TelegramBot(TOKEN, { polling: true })

const WeatherCoordinates = {
  LAT: 55.913842,
  LON: 37.828292,
}

const PROD = 'production'
const TEST = 'development'
const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'
const TRANSLATE_URL =
  'https://translate.api.cloud.yandex.net/translate/v2/translate'
const IAM_TOKENS_URL = 'https://iam.api.cloud.yandex.net/iam/v1/tokens'
const WEATHER_URL = `https://api.weather.yandex.ru/v2/forecast?lat=${WeatherCoordinates.LAT}&lon=${WeatherCoordinates.LON}&lang=ru_RU&limit=1&hours=false&extra=false`
const WEATHER_API_KEY = '9491ed85-00bf-4ee2-a321-90e48c32acb2'
const YANDEX_OAUTH_TOKEN = 'AgAAAAAs6XH4AATuwbCv3VlS2U8eilL83bCCoP8'
const DEFAULT_CHAT_ID = -1001438237715
const ALEXANDER_ID = 301723507
const EGER_ID = 237089463
const NOVAK_ID = 890777097
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
          `- получение iam-токена, ответ от сервера: ${JSON.stringify(
            responseData
          )}`
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

  if (fromId === EGER_ID) {
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
            `- перевод сообщения, ответ от сервера: ${JSON.stringify(
              responseData
            )}\n\n- iamToken: ${iamToken}`
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

bot.onText(/check_mode/, (msg) => {
  const chatId = msg.chat.id

  if (msg.from.id !== 301723507) {
    bot.sendMessage(chatId, '- нет доступа')
    return
  }

  bot.sendMessage(chatId, `- режим: ${mode}`)
})

bot.onText(/погода/, (msg) => {
  const chatId = msg.chat.id

  fetch(WEATHER_URL, {
    method: 'GET',
    headers: {
      'X-Yandex-API-Key': WEATHER_API_KEY,
    },
  })
    .then((response) => response.json())
    .then((responseData) => {
      if (mode === TEST) {
        bot.sendMessage(
          DEFAULT_CHAT_ID,
          `- получение погоды, ответ от сервера: ${JSON.stringify(
            responseData
          )}`
        )
      }

      const { geo_object: geoObject, fact } = responseData

      const locality = geoObject.locality.name
      const { temp, feels_like: feelsLike } = fact

      if (msg.from.id === NOVAK_ID) {
        bot.sendMessage(chatId, `до мая пизда холодно, а вообще ${temp}°`)
        return
      }

      bot.sendMessage(
        chatId,
        `${locality} ${temp}°\nощущается как ${feelsLike}°`
      )
    })
    .catch((error) => {
      bot.sendMessage(
        chatId,
        `- ошибка при получении погоды: ${error.name}\n- описание: ${error.message}`
      )
    })
})

let gameInit = false

const players = ['@wowyoulooksosad', '@novak_55', '@rubenovdev']

bot.onText(/пидр дня/, (msg) => {
  if (gameInit) {
    return
  }

  gameInit = true

  const randomInt = Math.floor(Math.random() * 3)
  const winner = players[randomInt]
  const chatId = msg.chat.id
  const interval = 1000

  bot.sendMessage(chatId, 'система поиска пидораса активирована...')

  for (let i = 1; i < 4; i++) {
    setTimeout(() => bot.sendMessage(chatId, 'пип'), interval * i)
  }

  setTimeout(() => bot.sendMessage(chatId, 'пииииип'), interval * 4)

  setTimeout(() => bot.sendMessage(chatId, 'пидорас найден'), interval * 5)

  setTimeout(() => bot.sendMessage(chatId, winner), interval * 6)

  setTimeout(() => {
    gameInit = false
  }, interval * 7)
})

bot.onText(/красавчик дня/, (msg) => {
  if (gameInit) {
    return
  }

  gameInit = true

  const randomInt = Math.floor(Math.random() * 3)
  const winner = players[randomInt]
  const chatId = msg.chat.id
  const interval = 1000

  bot.sendMessage(chatId, 'система поиска красавчика активирована...')

  for (let i = 1; i < 4; i++) {
    setTimeout(() => bot.sendMessage(chatId, 'пип'), interval * i)
  }

  setTimeout(() => bot.sendMessage(chatId, 'пииииип'), interval * 4)

  setTimeout(() => bot.sendMessage(chatId, 'красавчик найден'), interval * 5)

  setTimeout(() => bot.sendMessage(chatId, winner), interval * 6)

  setTimeout(() => {
    gameInit = false
  }, interval * 7)
})
