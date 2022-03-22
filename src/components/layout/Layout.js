import React, { Component } from "react";
import styled from "styled-components";
import Header from "./header/Header";
import Navigation from "./navigation/navigation";

import {
  getOpenCurrencyQuery,
  overlay,
} from "../../graphql/reactivities/state";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

class Layout extends Component {
  render() {
    return (
      <>
        <Header>
          <Navigation />
        </Header>
        <StyledMain overlay={overlay()}>
          {this.props.children}
        </StyledMain>
      </>
    );
  }
}

export default compose(
  graphql(getOpenCurrencyQuery, { name: "getOpenCurrencyQuery" })
)(Layout);

const StyledMain = styled.main`
  width: screen;
  margin: auto;
  background-color: ${(props) =>
    props.overlay ? "rgba(57, 55, 72, 0.22)" : "#FFFFFF"};
`;
