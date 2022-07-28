import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews // airbnb reviews data

export default class ReviewsModel {
    static async injectDB(conn) {
        if (reviews) {
            return // return if we already got the data from database
        }
        try {
            reviews = await conn.db(process.env.AIRBNB_NS).collection("reviews")
        } catch (e) {
            console.error(`Unable to establish collection handles in reviews.model: ${e}`)
        }
    }

    static async addReview(airbnbId, reviewer, comments, date) {
        try {
            // create the format of the review database using the passed in parameters
            const reviewDoc = { 
                reviewer_id: reviewer._id,
                reviewer_name: reviewer.name,
                comments: comments,
                airbnb_id: airbnbId,
                date: date,
            }
        
            return await reviews.insertOne(reviewDoc) // insert review to database
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, reviewerId, comments, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { _id: ObjectId(reviewId), reviewer_id: reviewerId },
                { $set: { comments: comments, date: date } },
            )
        
            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e }
        }
    }

    static async deleteReview(reviewId, reviewerId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                reviewer_id: reviewerId,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }
}