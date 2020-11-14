const fetch = require('node-fetch')

const IAM_TOKEN =
  't1.9euelZqPnJ3JjZqek8qYz5CZlJGTnu3rnpWaiszLy46cnYuNlZLMy5GSjZHl8_dDcEAC-u8nFXpE_t3z9wMfPgL67ycVekT-.saztk7UmBaIiCV6P9qj1iJ9jsL05_9MeVqP4ULwmwlB41Lf2AVA3xWPcYLpjDPSDdtqROFdliWTaoMLHKRZIDw'

const FOLDER_ID = 'b1gm1cj4shlranfpo7i1'

const url = 'https://translate.api.cloud.yandex.net/translate/v2/translate'

const data = {
  folderId: FOLDER_ID,
  texts: ['дай мой'],
  targetLanguageCode: 'en',
}

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${IAM_TOKEN}`,
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
