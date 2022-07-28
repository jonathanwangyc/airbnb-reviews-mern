import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
import AirbnbModel from './models/airbnb.model.js'
import ReviewsModel from './models/reviews.model.js'
dotenv.config() 

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000

// connect to database
MongoClient.connect(
    process.env.AIRBNB_DB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true }
    )
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await AirbnbModel.injectDB(client)
        await ReviewsModel.injectDB(client)
        // server start
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })