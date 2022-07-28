import React from "react"
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from "./components/add-review";
import Airbnb from "./components/airbnbs";
import AirbnbsList from "./components/airbnb-list";
import Login from "./components/login";

function App() {
  // simple login system to allow user to modify its own review
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null)
  }

  // part1 (basic bootstrap navbar): 
  //   Airbnb Reviews: main page
  //   Airbnbs: display all Airbnbs
  //   Login/Logout: to sign in/out 
  // part2 (different routes):
  //   Paths to different page
  return(
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/airbnbs" className="navbar-brand">
          Airbnb Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/airbnbs"} className="nav-link">
              Airbnbs
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/airbnbs"]} component={AirbnbsList} />
          <Route 
            path="/airbnbs/:id/review"
            render={(props) => (
              <AddReview {...props} user={user} />
            )}
          />
          <Route 
            path="/airbnbs/:id"
            render={(props) => (
              <Airbnb {...props} user={user} />
            )}
          />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} login={login} />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

export default App;
