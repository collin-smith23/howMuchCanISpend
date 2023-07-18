import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import HomePage from "./components/home";
import EventDetails from "./components/eventDetails/eventDetails";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!user) {
    return (
      <>
      <Navigation isLoaded={isLoaded}/>
      <HomePage/>
      </>
    )
  }

  return (
    <div className="app">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/event/:eventId">
            <EventDetails />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="*">
          <Redirect to="/" />
        </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
