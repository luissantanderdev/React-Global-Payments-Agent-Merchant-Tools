import * as React from 'react';
import { useState } from 'react';
import LoginForm from '../Views/LoginView';
import MainToolsView from '../Views/MainToolsView';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import './style.css';
import {
  ActiveSessionManager,
  LocalStorageSimulationServer,
  ServerManagerController,
} from '../Controller';
import { Credentials } from '../Model';

// ESTABLISH SERVER CONNECTION
// ----------------------------------------------------
const server = new ServerManagerController(new LocalStorageSimulationServer());
server.connect();
// -----------------------------------------------------

const Protected = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

export default function App(props) {
  let token, isSessionAlive;

  let session;

  // isSessionAlive = ActiveSessionManager.checkForActiveSessions();

  if (isSessionAlive) {
    // ActiveSessionManager.reestablisActiveSession();

    token = {
      // loggedIn: ActiveSessionManager.getActiveSession().isLoggedIn,
      // userName: ActiveSessionManager.getActiveSession().userName,
      // callHistory: ActiveSessionManager.reestablisActiveSession(),
    };
  }

  const [tokenization, updateToken] = useState(session);

  const [sessionToken, updateSessionToken] = useState(session);

  // FUNCTION
  const loginIntoToolsHandler = (credentials: Credentials) => {
    server.getServer().authenticateUser(credentials);

    if (!ActiveSessionManager.isSessionAlive()) return false;

    updateSessionToken(ActiveSessionManager.getActiveSession());

    return true;
  };

  // MARK: Log Out of the Screen
  const logOutOfToolsHandler = (e) => {
    console.log('Logging Out....');
    updateToken({
      loggedIn: false,
      user: '',
      callHistory: null,
    });

    // ActiveSessionManager.endSession();
  };

  let isLoggedIn = tokenization ? tokenization.loggedIn : false;

  isLoggedIn = false;

  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LoginForm loginIntoToolsHandler={loginIntoToolsHandler} />
            }
          />
          <Route
            path="/tools"
            element={
              <Protected isLoggedIn={isLoggedIn}>
                <MainToolsView
                  callHistory={isLoggedIn ? tokenization.callHistory : null}
                  user={isLoggedIn ? tokenization.user : null}
                  logOut={isLoggedIn ? logOutOfToolsHandler : null}
                />
              </Protected>
            }
          />
        </Routes>
      </Router>
    </React.Fragment>
  );
}
