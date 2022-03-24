import React, { Component } from "react";
import _ from "lodash";
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
  activeIcon,
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
  addToCart(product) {
    const attributes = product.attributes.map((attribute) => {
      return {
        name: attribute.name,
        id: attribute.items[0].id,
        value: attribute.items[0].value,
      };
    });

    const sortObject = (obj) => {
      const sorter = (a, b) => {
        return obj[a] - obj[b];
      };
      const keys = Object.keys(obj);
      keys.sort(sorter);
      const res = {};
      keys.forEach((key) => {
        res[key] = obj[key];
      });
      return res;
    };
    let carts = cartItems().filter(
      (cart) =>
        cart.product.id === product.id &&
        _.isEqual(sortObject(attributes), sortObject(cart.attributes))
    );
    if (carts.length === 0) {
      cartItems([...cartItems(), { product, attributes, qty: 1 }]);
      articleCount(articleCount() + 1);
    }
    else{
      const index = cartItems().indexOf(carts[0]);
      let cartItemsTemp = cartItems();
      cartItemsTemp.splice(index, 1,{
        product,
        attributes,
        qty:carts[0].qty+1
      });
      cartItems(cartItemsTemp)
      articleCount(articleCount() + 1);
    }
    overlay(false);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    localStorage.setItem("overlay", JSON.stringify(overlay()));
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
  }
  removeFromCart(product) {
    const cartItemsTemp = cartItems().filter(
      (cart) => cart.product.id !== product.id
    );

    cartItems([...cartItemsTemp]);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    activeIcon(false);
    localStorage.setItem("cartItems", activeIcon());
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
        <Link to={`${activeIcon() ? "/" : "../product"}`}>
          <StyledProductCardContainer
            onMouseOver={() => this.setState({ hover: true })}
            onMouseLeave={() => this.setState({ hover: false })}
            overlay={overlay()}
          >
            <ProductCard overlay={overlay()}>
              {/*  <ProductImageContainer> */}
              <ProductImage url={product.gallery[0]} />
              {/*   </ProductImageContainer> */}
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
              onMouseOver={() => activeIcon(true)}
              onMouseLeave={() => activeIcon(false)}
              onClick={() =>this.addToCart(product)
              }
            >
              <AddToCartIconImage
                onMouseOver={() => (this.hover = true)}
                onMouseLeave={() => (this.hover = false)}
                hover
                src={`${
                  inCart
                    ? activeIcon()
                      ?"assets/icons/cart/emptycart1.svg"
                      :"assets/icons/cart/emptycart1.svg"
                    : "assets/icons/cart/emptycart1.svg"
                }`}
                alt=''
              />
            </CartIcon>

              <Mask inStock={product.inStock}>
                <OutOfStock>
                  <OutOfStockText>OUT OF STOCK</OutOfStockText>
                </OutOfStock>
              </Mask>
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

const ProductImage = styled.div`
  cursor: pointer;
  list-style: none;
  width: 354px;
  height: 330px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color:transparent;
  margin-bottom:24px;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-image: ${(props) => `URL(${props.url})`};
    background-size: 356px auto, cover;
    background-repeat: no-repeat;
    background-color:transparent;
    opacity: 0.9;
  }
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
background-color:#5ECE7B;
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
  background-color:#5ECE7B;
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

const Mask = styled.div`
  position: relative;
  justify-content: center;
  align-items: center;
  top: -448px;
  left: 14.5px;
  display: ${(props) => (props.inStock ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  width: 356px;
  height: 330px;
  background-color: #FFFFFF;
  opacity:50%;
`;

const OutOfStock = styled.div`
  width: 356px;
  height: 39px;
  margin: auto;
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
