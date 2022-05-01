import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import cache from "./graphql/cache";

import { ApolloClient, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://react-0.herokuapp.com/grapghql",
  cache,
  connectToDevTools: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
