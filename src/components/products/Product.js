import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCartItemsQuery,
  getOverlayQuery,
  getFavouritesQuery,
  cartItems,
  overlay,
  activateRemoveIcon,
  amount,
  currentCurrency,
  articleCount,

} from "../../graphql/reactivities/state";
import { getCurrenciesQuery } from "../../graphql/queries/queries";

import "../../index.css";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }
  removeFromCart(product) {
    const cartItemsTemp = cartItems().filter(
      (cart) => cart.product.id !== product.id
    );

    cartItems([...cartItemsTemp]);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    activateRemoveIcon(false);
    localStorage.setItem("cartItems", activateRemoveIcon());
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
  }
  displayProduct() {
    const { product } = this.props;
    const { currentCurrency } = this.props.getCurrentCurrencyQuery;

    if (product) {
      const inCart = cartItems().find((cart) => cart.product.id === product.id);
      return (
        <Link
          style={{ texDecoration: "none", cursor: "default" }}
          to={`${inCart?activateRemoveIcon()?'/':'../product':'../product'}`}
        >
          <StyledProductCardContainer
            onMouseOver={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
            overlay={overlay()}
          >
            <ProductCard overlay={overlay()}>
              <ProductImageContainer>
                <ProductImage src={product.gallery[0]} alt='Product' />
              </ProductImageContainer>
              <ProductDetails>
                <ProductName inStock={product.inStock}>
                  {product.name}
                </ProductName>
                <Price>
                  <PriceCurrency inStock={product.inStock}>
                    {this.props.selectedCurrency.symbol}
                  </PriceCurrency>
                  <PriceAmount inStock={product.inStock}>
                    {
                      product.prices.find(
                        (price) =>
                          price.currency.label === currentCurrency.label
                      ).amount
                    }
                  </PriceAmount>
                </Price>
              </ProductDetails>
            </ProductCard>
            <CartIcon
              inCart={inCart}
              inStock={product.inStock}
              hover={this.state.hover}
              onMouseOver={() => (inCart ? activateRemoveIcon(true) : null)}
              onMouseLeave={() => (inCart ? activateRemoveIcon(false) : null)}
              onClick={() => this.removeFromCart(product)}
            >
              <AddToCartIconImage
                onMouseOver={() => (this.hover = true)}
                onMouseLeave={() => (this.hover = false)}
                hover
                src={`${
                  inCart
                    ? activateRemoveIcon()
                      ? "assets/icons/cart/basket-.svg"
                      : "assets/icons/cart/emptycart1.svg"
                    : "assets/icons/cart/emptycart1.svg"
                }`}
                alt=''
              />
            </CartIcon>

            <LeaveWhiteBrooch inStock={product.inStock}>
              <Mask inStock={product.inStock}>
              <OutOfStock>
                <OutOfStockText >
                  OUT OF STOCK
                </OutOfStockText>
              </OutOfStock>
              </Mask>
            </LeaveWhiteBrooch>
          </StyledProductCardContainer>
        </Link>
      );
    }
  }

  render() {
    return <div>{this.displayProduct()}</div>;
  }
}

export default compose(
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getOverlayQuery, { name: "getOverlayQuery" }),
  graphql(getCartItemsQuery, { name: "getCartItemsQuery" }),
  graphql(getFavouritesQuery, { name: "getFavouritesQuery" })
)(Product);

const StyledProductCardContainer = styled.div`
  width: 386px;
  height: 444px;
  cursor: pointer;
  background-color: ${(props) => (!props.overlay ? "var(--c-white)" : "")};
  &:hover {
    filter: drop-shadow(0px 4px 35px rgba(168, 172, 176, 0.19));
  }
`;

const ProductCard = styled.div`
  position: relative;
  padding: 16px;
  margin: auto;
  width: 386px;
  height: 412px;
  background-color: ${(props) => (props.overlay ? "" : "#FFFFFF")};
`;
const ProductImageContainer = styled.div`
  overflow: hidden;
  object-fit: contain;
  width: 354px;
  height: 330px;
  margin-bottom: 24px;
  background-color: ${(props) => (props.overlay ? "" : " #c4c4c4")};
`;

const ProductImage = styled.img`
  width: 354px;
  height: 330px;
`;
const ProductDetails = styled.div`
  color: #8d8f9a;
  font-family: Raleway;
  font-style: normal;
`;

const ProductName = styled.p`
  font-family: Raleway-light;
  font-weight: 300;
  font-size: 18px;
  line-height: 28.8px;
  line-height: 160%;
  letter-spacing: 0px;
  text-align: left;
  color: ${(props) => (props.inStock ? "#1D1F22" : "#8D8F9A")};
  vertical-align: top;
`;
const Price = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex.start;
`;
const PriceCurrency = styled.div`
  font-family: Raleway-medium;
  font-weight: 500;
  font-size: 18px;
  line-height: 29px;
  line-height: 160%;
  letter-spacing: 0em;
  text-align: right;
  margin-right: 4px;
  color: ${(props) => (props.inStock ? "#1D1F22" : "#8D8F9A")};
`;

const PriceAmount = styled.div`
  font-family: Raleway-medium;
  font-weight: 500;
  font-size: 18px;
  line-height: 29px;
  line-height: 160%;
  letter-spacing: 0em;
  text-align: right;
  color: ${(props) => (props.inStock ? "#1D1F22" : "#8D8F9A")};
`;

const CartIcon = styled.div`
/* display:${(props) => (props.inCart ? "block" : "none")}; */
position: relative;
border-radius:50%;
top: -92px;
left:303px;
width:52px;
height:52px;
z-index:20;
background-color:#5ECE7B;/* ${(props) =>
  props.inCart ? (props.hover ? "#ff7800 " : "#5ECE7B") : "#5ECE7B"}; */
visibility:${(props) =>
  props.inStock
    ? !props.inCart
      ? props.hover
        ? "visible"
        : "hidden"
      : props.hover
      ? "visible"
      : "visible"
    : "hidden"};
filter:	drop-shadow(0px	4px	11px rgba(29, 31, 34, 0.1));
cursor:pointer; 
&:hover{
  background-color:${(props) => (props.inCart ? "#ff7800 " : "#5ECE7B")};
  }
}
`;

const AddToCartIconImage = styled.img`
  width: 24px;
  height: 21px;
  margin-left: 14px;
  margin-right: 14px;
  margin-top: 15.5px;
  margin-bottom: 15.5px;
`;

const LeaveWhiteBrooch = styled.div`
  position: relative;
  display: ${(props) => (props.inStock ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  top: -452px;
  left: 15px;
  width: 356px;
  height: 338px;
  background-color:#FFFFFF;
  opacity:50%;
  z-index: 20;
`;

const Mask = styled.div`
   display:flex;
  justify-content: center;
  align-items: center;
  width: 354px;
  height: 330px;
  background-color:#C4C4C4;
`;

const OutOfStock = styled.div`
  width: 356px;
  height: 39px;
  margin:auto;
`;
const OutOfStockText = styled.p`
  font-family: Raleway;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 38.4px;
  line-height: 160%;
  letter-spacing: 0px;
  text-align: center;
  color: #8d8f9a;
`;
