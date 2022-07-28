import express from 'express'
import cors from 'cors'
import airbnb from './routes/api/airbnb.route.js'

const app = express()

app.use(cors())
app.use(express.json()) // allow passing json in the body of the request

app.use("/api/v1/airbnb", airbnb) // contains all the valid links
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app // export as module