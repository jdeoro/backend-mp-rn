import express from "express";
import dotenv from 'dotenv'
import cors from "cors";


import rutas from './routes/route.users.js'

//import rutas from './routes/route.users+.js'
dotenv.config()

const port = process.env.PORT || 3000;
const version = process.env.VERSION || "1.0.0";

const app = express();

app.use(cors())
app.use(express.json())
app.use(rutas)

app.listen(port, () => console.log(`server started on ${port} version ${version}`))
