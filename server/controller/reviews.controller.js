import ReviewsModel from '../models/reviews.model.js'

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const airbnbId = req.body.airbnb_id
            const comments = req.body.text
            const reviewerInfo = {
                name: req.body.name,
                _id: req.body.reviewer_id
            }
            const date = new Date()
        
            const reviewResponse = await ReviewsModel.addReview(
                airbnbId,
                reviewerInfo,
                comments,
                date,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const comments = req.body.text
            const date = new Date()
        
            const reviewResponse = await ReviewsModel.updateReview(
                reviewId,
                req.body.reviewer_id,
                comments,
                date,
            )
        
            // error handling
            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error })
            }
        
            // if nothing is updated in the database
            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id
            const reviewerId = req.body.reviewer_id

            const reviewResponse = await ReviewsModel.deleteReview(
                reviewId,
                reviewerId,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}
