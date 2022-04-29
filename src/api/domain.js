const MODE = process.env.MODE
const ENV = process.env.ENV
const domain = {
  local: {
    Api_Base_Url: '/api',
  },
  server: {
    Api_Base_Url: `https://api${ENV}.mumuxili.com`,

  },
}

export default domain[MODE]
