import React, { useState, useEffect } from "react";
import AirbnbDataService from "../services/airbnb";
import { Link } from "react-router-dom";

const AirbnbsList = props => {
  const [airbnbs, setAirbnbs] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchAccommodate, setSearchAccommodate ] = useState("");
  const [searchPrice, setSearchPrice ] = useState("");
  const [searchCountry, setSearchCountry ] = useState("");
  const [countries, setCountries] = useState(["All Countries"]);

  // request data when loading
  useEffect(() => {
    retrieveAirbnbs();
    retrieveCountries();
  }, []);

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchAccommodate = e => {
    const searchAccommodate = e.target.value;
    setSearchAccommodate(searchAccommodate);
  };

  const onChangeSearchPrice = e => {
    const searchPrice = e.target.value;
    setSearchPrice(searchPrice);
  };

  const onChangeSearchCountry = e => {
    const searchCountry = e.target.value;
    setSearchCountry(searchCountry);
  };

  // making api call to retrieve all airbnb data
  const retrieveAirbnbs = () => {
    AirbnbDataService.getAll()
      .then(response => {
        console.log(response.data);
        setAirbnbs(response.data.airbnbs);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCountries = () => {
    AirbnbDataService.getCountries()
      .then(response => {
        console.log(response.data);
        setCountries(["All Countries"].concat(response.data));
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveAirbnbs();
  };

  const find = (query, by) => {
    AirbnbDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setAirbnbs(response.data.airbnbs);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name")
  };

  const findByAccommodate = () => {
    find(searchAccommodate, "accommodates")
  };

  const findByPrice = () => {
    find(searchPrice, "price")
  };

  const findByCountry = () => {
    if (searchCountry == "All Countries") {
      refreshList();
    } else {
      find(searchCountry, "country")
    }
  };

  // part1 (search bars):
  //   allow user to search by name, accommodate, and price
  // part2 (display airbnbs):
  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search by accommodate"
            value={searchAccommodate}
            onChange={onChangeSearchAccommodate}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByAccommodate}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Search by price"
            value={searchPrice}
            onChange={onChangeSearchPrice}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByPrice}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg">

          <select onChange={onChangeSearchCountry}>
             {countries.map(country => {
               return (
                 <option value={country}> {country.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCountry}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {airbnbs.map((airbnb) => {
          const address = `${airbnb.address.street}`;
          return (
            <div className="col-lg-5 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{airbnb.name}</h5>
                  <p className="card-text">
                    <strong>Summary: </strong>{airbnb.summary.substr(0, 200)}<br/>
                    <strong>Address: </strong>{address}<br/>
                    <strong>Ratings: </strong>{airbnb.review_scores.review_scores_rating}<br/>
                  </p>
                  <div className="row">
                  <Link to={"/airbnbs/"+airbnb._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default AirbnbsList;