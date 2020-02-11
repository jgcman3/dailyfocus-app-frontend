import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Containers/Home";
import NotFound from "./Containers/NotFound";
import Login from "./Containers/Login";
import Signup from "./Containers/Signup";
import NewNote from "./Containers/NewNote";
import Week from "./Containers/Week";
import Notes from "./Containers/Notes";
import AppliedRoute from "./Components/AppliedRoute";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute path="/Login" exact component={Login} appProps={appProps} />
      <AppliedRoute
        path="/signup"
        exact
        component={Signup}
        appProps={appProps}
      />
      <AppliedRoute
        path="/notes/new"
        exact
        component={NewNote}
        appProps={appProps}
      />
      <AppliedRoute path="/week" exact component={Week} appProps={appProps} />
      <AppliedRoute
        path="/notes/:id"
        exact
        component={Notes}
        appProps={appProps}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
