const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const TOKEN = '1457856506:AAFAz3MNayQiPc7h0Xe8ZpTYBrdnyOU4vyw'
const bot = new TelegramBot(TOKEN, { polling: true })

const IAM_TOKEN =
  't1.9euelZqPnJ3JjZqek8qYz5CZlJGTnu3rnpWaiszLy46cnYuNlZLMy5GSjZHl8_dDcEAC-u8nFXpE_t3z9wMfPgL67ycVekT-.saztk7UmBaIiCV6P9qj1iJ9jsL05_9MeVqP4ULwmwlB41Lf2AVA3xWPcYLpjDPSDdtqROFdliWTaoMLHKRZIDw'
const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'
const URL = 'https://translate.api.cloud.yandex.net/translate/v2/translate'

const RU = 'ru'

bot.on('message', (msg) => {
  if (msg.from.id === 237089463) {
    const { text } = msg

    if (text.length < 4 || text.split(' ').length < 2 || !text.toLowerCase().match(/[a-z]/)) {
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
      .then((response) => {
        console.log('response: ', response)
        return response.json()
      })
      .then((responseData) => {
        bot.sendMessage(chatId, responseData.translations[0].text)
      })
  }
})

// bot.onText(/мда/, (msg) => {
//   console.log(msg)
// })

// {
//   message_id: 63832,
//   from: {
//     id: 237089463,
//     is_bot: false,
//     first_name: '𝒟𝒾𝓂𝒶 ��𝑔𝑒𝓇'        ,
//     username: 'wowyoulooksosad'
//   },
//   chat: { id: -1001438237715, title: 'питер', type: 'supergroup' },
//   date: 1605355164,
//   text: '/start',
//   entities: [ { offset: 0, length: 6, type: 'bot_command' } ]
// }

// message_id: 63913,
// from: {
//   id: 301723507,
//   is_bot: false,
//   first_name: 'Александр',
//   last_name: 'Рубенов',
//   username: 'rubenovdev'
// },
// chat: { id: -1001438237715, title: 'питер', type: 'supergroup' },
// date: 1605358073,
// text: '/дай мой id'
// }
