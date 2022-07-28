import React, { useState, useEffect } from "react";
import AirbnbDataService from "../services/airbnb";
import { Link } from "react-router-dom";

const Airbnb = props => {
  const initialAirbnbState = {
    id: null,
    name: "",
    address: {},
    country: "",
    reviews: [],
    listing_url: ""
  };
  // store airbnb data
  const [airbnb, setAirbnb] = useState(initialAirbnbState);

  const getAirbnb = id => {
    AirbnbDataService.get(id)
      .then(response => {
        setAirbnb(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // render only if id is updated
  useEffect(() => {
    getAirbnb(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    AirbnbDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setAirbnb((prevState) => {
          prevState.reviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {airbnb ? (
        <div>
          <h5>{airbnb.name}</h5>
          <p>
            <strong>Description: </strong>{airbnb.description}<br/>
            <strong>Property Type: </strong>{airbnb.property_type}<br/>
            <strong>Accommodates: </strong>{airbnb.accommodates}<br/>
            <strong>Country: </strong>{airbnb.address.country}<br/>
            <strong>Address: </strong>{airbnb.address.street}<br/>
            <strong>Price: </strong>{airbnb.price ? JSON.stringify(airbnb.price).slice(19, -2) : 0}<br/>
          </p>
          <a target="_blank" href={airbnb.listing_url} className="btn btn-primary col-lg-5 mx-1 mb-1">View Website</a>
          <Link to={"/airbnbs/" + props.match.params.id + "/review"} className="btn btn-primary col-lg-5 mx-1 mb-1">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {airbnb.reviews.length > 0 ? (
             airbnb.reviews.map((review, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {review.comments}<br/>
                         <strong>User: </strong>{review.reviewer_name}<br/>
                         <strong>Date: </strong>{review.date}
                       </p>
                       {props.user && props.user.id === review.reviewer_id &&
                          <div className="row">
                            <a onClick={() => deleteReview(review._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={{
                              pathname: "/airbnbs/" + props.match.params.id + "/review",
                              state: {
                                currentReview: review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No airbnb selected.</p>
        </div>
      )}
    </div>
  );
};

export default Airbnb;
