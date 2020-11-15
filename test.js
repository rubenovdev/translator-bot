const fetch = require('node-fetch')

fetch('https://iam.api.cloud.yandex.net/ffaiam/v1/tokens', {
  method: 'POST',
  body: JSON.stringify({
    yandexPassportOauthToken: 'AgAAAAAs6XH4AATuwbCv3VlS2U8eilL83bCCoP8',
  }),
})
  .then((response) => response.json())
  .then(({ iamToken }) => console.log('iamToken: ', iamToken))
  .catch((error) => {
    console.log('error.name: ', error.name)
    console.log('error.message: ', error.message)
    console.log('error: ', error)
  })
