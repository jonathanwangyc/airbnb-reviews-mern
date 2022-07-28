import React, { useState } from "react";
import AirbnbDataService from "../services/airbnb";
import { Link } from "react-router-dom";

const AddReview = props => {
  let initialReviewState = ""
  let editing = false; // whether to add or edit review

  if (props.location.state && props.location.state.currentReview) {
    editing = true;
    initialReviewState = props.location.state.currentReview.comments
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    var data = {
      text: review,
      reviewer_name: props.user.name,
      reviewer_id: props.user.id,
      airbnb_id: props.match.params.id
    };

    if (editing) {
      data.review_id = props.location.state.currentReview._id
      AirbnbDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      AirbnbDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/airbnbs/" + props.match.params.id} className="btn btn-success">
              Back to Airbnb
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={review}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddReview;
