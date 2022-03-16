import React, { Component } from "react";
import styled from "styled-components";
import Cart from "../cart";
import Header from "./header/Header";
import Navigation from "./navigation/navigation";

import {
  getOverlayQuery,
  getOpenCurrencyQuery,
  overlay,
  openCurrency,
} from "../../graphql/reactivities/state";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";
import Currency from "../currencies/Currency";

class Layout extends Component {
  render() {
    return (
      <>
        <Header>
          <Navigation />
          {openCurrency() && <Currency />}
          {overlay() && <Cart overlay={overlay()} />}
        </Header>
        <StyledMain overlay={overlay()}>
          {this.props.children}
        </StyledMain>
      </>
    );
  }
}

export default compose(
  graphql(getOverlayQuery, { name: "getOverlayQuery" }),
  graphql(getOpenCurrencyQuery, { name: "getOpenCurrencyQuery" })
)(Layout);

const StyledMain = styled.main`
  width: screen;
  margin: auto;
  background-color: ${(props) =>
    props.overlay ? "rgba(57, 55, 72, 0.22)" : "#FFFFFF"};
`;
