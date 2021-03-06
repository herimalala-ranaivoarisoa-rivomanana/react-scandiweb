import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import ClickAwayListener from "../ClickAwayLIstner";

import {
  getAmountQuery,
  cartItems,
  overlay,
  currentCurrency,
  amount,
  articleCount,
} from "../../graphql/reactivities/state";

import CartItem from "./CartItem";

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0,
    };
    amount();
    this.leaveOverlay = this.leaveOverlay.bind(this);
  }
  nodebtn = undefined;

  leaveOverlay() {
    overlay(false);
    localStorage.setItem("overlay", JSON.stringify(overlay()));
  }

  render() {
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
    articleCount(0);
    cartItems().map((item) => articleCount(articleCount() + item.qty));
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
    return (
      <ClickAwayListener nodeRef={this.nodebtn} onClickAway={this.leaveOverlay}>
        <CardContainer className='overlay' overlay={overlay()}>
          {!overlay() && <PageTitle overlay={overlay()}>CART</PageTitle>}
          {overlay() && (
            <Title>
              <TitlePart1>My Bag </TitlePart1>
              <TitlePart2>{cartItems().length} items </TitlePart2>
            </Title>
          )}
          <Content overlay={overlay()}>
            {cartItems().map((cart, index) => {
              return (
                <Item key={index}>
                  {" "}
                  <CartItem cart={cart} />
                </Item>
              );
            })}
          </Content>
          <div>
            {overlay() && (
              <Amount>
                <AmountLabel>Total</AmountLabel>
                <AmountValue>
                  {currentCurrency().symbol}
                  {amount().toFixed(2)}
                </AmountValue>
              </Amount>
            )}
            {overlay() && (
              <CtaContainer>
                <Link to='/cart'>
                  <CtaCart onClick={this.leaveOverlay}>VIEW BAG</CtaCart>
                </Link>
                <Link to='/checkout'>
                  <CtaCheckout onClick={this.leaveOverlay}>
                    CHECK OUT
                  </CtaCheckout>
                </Link>
              </CtaContainer>
            )}
          </div>
        </CardContainer>
      </ClickAwayListener>
    );
  }
}

export default compose(graphql(getAmountQuery, { name: "getAmountQuery" }))(
  Cart
);

const CardContainer = styled.div`
  position: ${(props) => (props.overlay ? "relative" : "")};
  z-index: ${(props) => (props.overlay ? "100" : "0")};
  top: ${(props) => (props.overlay ? "56px" : "")};
  left: ${(props) => (props.overlay ? "680px" : "")};
  width: ${(props) => (props.overlay ? "325px" : "1440px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  margin: auto;
  padding:8px 16px 20px 16px;
`;

const PageTitle = styled.div`
  width: 1098px;
  height: 179px;
  padding-top: 80px;
  margin-left: 100px;
  font-family: Raleway-bold;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
  border-bottom: ${(props) => (props.overlay ? "none" : "2px solid #E5E5E5")};
  visibility: ${(props) => (props.overlay ? "hidden" : "visible")};
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  height: 26px;
  margin-bottom: 25px;
`;

const TitlePart1 = styled.div`
  font-family: Raleway-medium;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
  line-height: 160%;
  letter-spacing: 0em;
  text-align: right;
  margin-right: 6px;
  padding-left: 24px;
`;

const TitlePart2 = styled.div`
  font-family: Raleway-medium;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 25.6px;
  letter-spacing: 0em;
  text-align: right;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: ${(props) => (props.overlay ? "309px" : "1098px")};
  max-height: ${(props) => (props.overlay ? "540px" : "")};
  overflow-y:auto;
  overflow-x:hidden;
  margin-left: ${(props) => (props.overlay ? "" : "101px")};
  margin-right: ${(props) => (props.overlay ? "" : "101px")};
`;

const Item = styled.li`
  list-style: none;
`;

const Amount = styled.div`
  width: 293px;
  height: 20px;
  margin: auto;
  margin-top:20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const AmountLabel = styled.p`
  font-family: Roboto-medium;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  line-height: 96%;
  letter-spacing: 0em;
  text-align: left;
`;

const AmountValue = styled.div`
  font-family: Raleway-bold;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  line-height: 160%;
  letter-spacing: 0em;
  text-align: right;
`;

const CtaContainer = styled.div`
  width: 293px;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 35px;
  margin-botoom: 20px;
`;
const CtaCart = styled.div`
  width: 140px;
  height: 43px;
  text-align: center;
  font-family: Raleway-semibold;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16.8px;
  line-height: 120%;
  letter-spacing: 0em;
  background-color: var(--c-white);
  color: #1d1f22;
  cursor: pointer;
  border: 1px solid #1d1f22;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CtaCheckout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 43px;
  text-align: center;
  font-family: Raleway-semibold;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16.8px;
  line-height: 120%;
  letter-spacing: 0em;
  background-color: #5ece7b;
  border: 1px solid #5ece7b;
  color: white;
  cursor: pointer;
`;
