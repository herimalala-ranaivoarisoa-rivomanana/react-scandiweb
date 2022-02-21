import React, { Component } from "react";
import Cart from "../cart";
import Header from "./header/Header";
import Navigation from "./navigation/navigation";

import { getOverlayQuery, overlay } from "../../graphql/reactivities/state";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <Header>
          <Navigation />
        </Header>
        <main>{this.props.children}</main>
        {overlay() && <Cart overlay={overlay()} />}
      </React.Fragment>
    );
  }
}

export default compose(graphql(getOverlayQuery, { name: "getOverlayQuery" }))(
  Layout
);
