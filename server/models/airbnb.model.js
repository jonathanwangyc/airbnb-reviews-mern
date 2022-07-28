let airbnbs // airbnb data

export default class AirbnbModel {
    // async/await is a syntactic sugar for promises
    static async injectDB(conn) {
        if (airbnbs) { 
            return // return if we already got the data from database
        }
        try {
            // try getting the listingsAndReviews collection inside sample_airbnb database
            airbnbs = await conn.db(process.env.AIRBNB_NS).collection('listingsAndReviews')
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in airbnb.model: ${e}`,
            )
        }
    }

    static async getAirbnbs({
        filters = null,
        page = 0,
        airbnbsPerPage = 20, // number of airbnbs to display per page
    } = {}) {
        let query
        if (filters) {
            if ('name' in filters) {
                query = { $text: { $search: filters['name'] } } // search for the name in db
            } else if ('accommodates' in filters) {
                query = { 'accommodates': { $eq: parseInt(filters['accommodates']) } } // filter the specified int
            } else if ('price' in filters) {
                query = { 'price': { $lt: parseFloat(filters['price']) } } // filter price less than specified
            } else if ('country' in filters) {
                query = { 'address.country': { $eq: filters['country'] } } // filter the specified string
            }
        }

        let cursor
        try {
            cursor = await airbnbs.find(query) // perform the search based on query and store results in cursor
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { aitbnbList: [], airbnbCount: 0 } // return empty result
        }

        // get to the correct page and display number
        const searchResult = cursor.limit(airbnbsPerPage).skip(airbnbsPerPage * page) 

        try {
            const aitbnbList = await searchResult.toArray()
            const airbnbCount = await airbnbs.countDocuments(query)

            return { aitbnbList, airbnbCount }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or count documents, ${e}`,
            )
            return { aitbnbList: [], airbnbCount: 0 }
        }
    }

    static async getAirbnbByID(id) {
        try {
            const pipeline = [
            {
                $match: { _id: id, }, // find the correct airbnb data
            },
            {
                $lookup: {
                    from: "reviews", // look inside the reviews collection
                    let: { id_to_match: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                // find the data that have matching airbnb_id and id
                                $expr: { $eq: ["$airbnb_id", "$$id_to_match"], },
                            },
                        },
                        {
                            $sort: { date: -1, },
                        },
                    ],
                    as: "reviews", // stored the matching reviews
                },
            },
            {
                // add the matching reviews under corresponding airbnb
                $addFields: { reviews: "$reviews", }, 
            },
            ]
            return await airbnbs.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getAirbnbByID: ${e}`)
            throw e
        }
    }

    static async getCountries() {
        let countries = []
        try {
            countries = await airbnbs.distinct("address.country")
            return countries
        } catch (e) {
            console.error(`Unable to get countries, ${e}`)
            return countries
        }
    }
}