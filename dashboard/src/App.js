import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import Usuario from "layouts/Usuario.jsx";
import Ejercicio from "layouts/Ejercicio.jsx";
import Login from "layouts/Login.jsx";
import "assets/css/material-dashboard-react.css?v=1.6.0";

const hist = createBrowserHistory();

class App extends Component {
  render() {
    return (
      <Router history={hist}>
        <Switch>
          <Route path="/usuarios" component={Usuario} />
          <Route path="/ejercicios" component={Ejercicio} />
          <Route path="/login" component={Login} />
          <Redirect from="/" to="/usuarios" />
        </Switch>
      </Router>
    );
  }
}

export default App;
