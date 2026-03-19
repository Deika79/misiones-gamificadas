import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-hqumeedij6hm8jio.us.auth0.com"
      clientId="1jJgXJAN9YHNjRwCAcsKJoEOR31151qT"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
<Auth0Provider
  domain="dev-hqumeedij6hm8jio.us.auth0.com"
  clientId="1jJgXJAN9YHNjRwCAcsKJoEOR31151qT"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "https://misiones-api"
  }}
></Auth0Provider>