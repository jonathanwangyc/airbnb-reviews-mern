import express from 'express'
import AirbnbCtrl from '../../controller/airbnb.controller.js'
import ReviewsCtrl from '../../controller/reviews.controller.js'

const router = express.Router()

router.route('/').get(AirbnbCtrl.apiGetAirbnbs)
router.route("/id/:id").get(AirbnbCtrl.apiGetAirbnbById)
router.route("/countries").get(AirbnbCtrl.apiGetAirbnbCountries)

router.route('/review')
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router