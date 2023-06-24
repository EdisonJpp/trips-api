import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve(__dirname, '../.env')
})

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  google_api: process.env.GOOGLE_API,
  google_api_key: process.env.GOOGLE_API_KEY,
  trips_database: process.env.TRIPS_DATABASE
}

export default config
