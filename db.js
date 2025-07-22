import { createPool} from 'mysql2/promise'
//import { Pool } from 'pg'

import { DB_HOST,DB_NAME,DB_PASSWORD,DB_USER,DB_PORT} from './config.js'

 export const pool = createPool({
     host:DB_HOST,
     user:DB_USER,
     password:DB_PASSWORD,
     database:DB_NAME,
     port:DB_PORT
 })

//export const pool = new Pool({
//    host:DB_HOST,
//    user:DB_USER,
//    password:DB_PASSWORD,
//    database:DB_NAME,
//    port:DB_PORT
//})

