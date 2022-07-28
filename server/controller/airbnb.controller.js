import AirbnbModel from '../models/airbnb.model.js'

export default class AirbnbController {
    static async apiGetAirbnbs(req, res, next) {
        // retrieve the information in the request query 
        const airbnbsPerPage = req.query.airbnbsPerPage ? parseInt(req.query.airbnbsPerPage, 10) : 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}
        if (req.query.accommodates) {
            filters.accommodates = req.query.accommodates
        } else if (req.query.price) {
            filters.price = req.query.price
        } else if (req.query.country) {
            filters.country = req.query.country
        } else if (req.query.name) {
            filters.name = req.query.name
        } 

        // make a function call to the model to get the airbnb list
        const { aitbnbList, airbnbCount } = await AirbnbModel.getAirbnbs({
            filters,
            page,
            airbnbsPerPage,
        })

        // create a response when api is called
        let response = {
            airbnbs: aitbnbList,
            page: page,
            filters: filters,
            entries_per_page: airbnbsPerPage,
            total_results: airbnbCount,
        }
        res.json(response)
    }

    static async apiGetAirbnbById(req, res, next) {
        try {
            let id = req.params.id || {}
            let airbnb = await AirbnbModel.getAirbnbByID(id)
            if (!airbnb) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(airbnb)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
      }
    
    static async apiGetAirbnbCountries(req, res, next) {
        try {
            let countries = await AirbnbModel.getCountries()
            res.json(countries)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}