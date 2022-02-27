import React, { Component } from "react";
import styled from "styled-components";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  currentCurrency,
  cartItems,
  amount,
  openCurrency,
} from "../../graphql/reactivities/state";
import { getCurrenciesQuery } from "../../graphql/queries/queries";

class Currency extends Component {
  setCurrentCurrency(obj) {
    const { currencies } = this.props.getCurrenciesQuery;
    var currency = currencies.find((item) => item.label === obj.label);
    currentCurrency(currency);
    localStorage.setItem("currentCurrency", JSON.stringify(currency));
    amount(0);
    cartItems().map((item) =>
      amount(
        amount() +
          item.qty *
            item.product.prices.find(
              (price) => price.currency.label === currentCurrency().label
            ).amount
      )
    );
    localStorage.setItem("amount", JSON.stringify(amount()));
    openCurrency(false);
    localStorage.setItem("openCurrency", JSON.stringify(openCurrency()));
  }

  render() {
    const { currencies } = this.props.getCurrenciesQuery;
    return (
      <CurrencyList>
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
    );
  }
}
export default compose(
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" })
)(Currency);

const CurrencyList = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 65px;
  left: 1356px;
  z-index: 200;
  width: 114px;
  padding-top: 20px;
  paddign-left: 20px;
  background: var(--c-white);
  box-shadow: 0px 4px 35px 0px #a8acb030;
`;

const CurrencyItem = styled.div`
  display: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 54px;
  padding: 0;
  margin: 0;
  margin-left: 20px;
  margin-bottom: 21px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 20px;
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
