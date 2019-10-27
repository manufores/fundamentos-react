import React from 'react';
import 'bulma/css/bulma.css';
import './index.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { UserProvider } from './context/user';
import { restoreUser } from './utils/storage';
import Register from './components/Register';
import Apiview from './components/Apiview';
import AdvDetail from './components/AdvDetail';
import CreateUpdateAd from './components/CreateUpdateAd';
import Search from './components/Search';
import ErrorBoundary from './components/ErrorBoundary';

// import Profile from './src/components/Profile';
// import api from './utils/api';
// import { deleteStorage } from '/src/utils/storage';



export default class App extends React.Component {
  constructor(props) {
    super(props);
    // this.updateUser = this.updateUser.bind(this);
    const user = restoreUser();
    this.state = {
      // user: {},
      session: user,


      // updateUser: this.updateUser



    }
  }

  updateUser(user) {
    console.log('Entra en update users de app');
    this.setState({ user })
  }





  render() {

    return (
      <div>
        <ErrorBoundary>
          <UserProvider value={this.state}>
            <Router>

              <Switch>

                <Route exact path="/register" component={Register} />

                <Route exact path='/api' component={Apiview} />
                <Route exact path='/busqueda/:search' component={Search} />
                <Route exact path="/redirect/:search" render={
                  (props) => {
                    var search = props.match.params.search;
                    return <Redirect to={'/busqueda/' + search} />
                  }
                } />
                <Route exact path='/creaupdate' component={CreateUpdateAd} />
                <Route exact path='/editar/:id' component={CreateUpdateAd} />
                <Route exact path="/detail/:id" component={AdvDetail} />
                <Route component={Register} />

              </Switch>

            </Router>
          </UserProvider>
        </ErrorBoundary>

      </div>
    )
  }
}