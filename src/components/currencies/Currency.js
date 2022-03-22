import React, { Component } from "react";
import styled from "styled-components";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import ClickAwayListener from "../ClickAwayLIstner";

import {
  getCurrentCurrencyQuery,
  currentCurrency,
  openCurrency,
} from "../../graphql/reactivities/state";
import { getCurrenciesQuery } from "../../graphql/queries/queries";

class Currency extends Component {
  nodebtn=undefined;
  setCurrentCurrency(obj) {
    const { currencies } = this.props.getCurrenciesQuery;
    var currency = currencies.find((item) => item.label === obj.label);
    currentCurrency(currency);
    localStorage.setItem("currentCurrency", JSON.stringify(currency));
    openCurrency(false);
    localStorage.setItem("openCurrency", JSON.stringify(openCurrency()));
  }

  leaveOverlay(){
    openCurrency(false);
    localStorage.setItem("openCurrency", JSON.stringify(openCurrency()));
  }

  render() {
    const { currencies } = this.props.getCurrenciesQuery;
    return (
      <ClickAwayListener
      nodeRef={this.nodebtn}
      onClickAway={this.leaveOverlay}
      >
        <CurrencyList ref={this.insideContainer}>
          {currencies &&
            currencies.map((currency) => {
              return (
                <CurrencyItem
                  onClick={(e) => this.setCurrentCurrency(currency)}
                  key={currency.label}
                >
                  <CurrencySymbol>{currency.symbol}</CurrencySymbol>
                  <CurrencyLabel>{currency.label}</CurrencyLabel>
                </CurrencyItem>
              );
            })}
        </CurrencyList>
      </ClickAwayListener>
    );
  }
}
export default compose(
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" })
)(Currency);

const CurrencyList = styled.div`
  position: relative;
  top:65px;
  left:910px;
  right:-34px;
  z-index: 200;
  display: flex;
  flex-direction: column;

  width: 114px;
  padding-top: 20px;
  paddign-left: 20px;
  background: var(--c-white);
  box-shadow: 0px 4px 35px 0px rgba(57, 55, 72, 0.22);
`;

const CurrencyItem = styled.div`
  display: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20px;
  margin: 0;
  margin-bottom: 21px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 20px;
  }
    &:hover {
    box-shadow:0px 4px 35px 2px #E5E5E5;
  }
`;
const CurrencySymbol = styled.div`
  padding: 0;
  margin: 0;
  margin-right: 4px;
  font-family: Raleway;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: right;
`;

const CurrencyLabel = styled.div`
  padding: 0;
  margin: 0;
  font-family: Raleway;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: right;
`;
