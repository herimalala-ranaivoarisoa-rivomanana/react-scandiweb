import React, { Component } from "react";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  cartItems,
  amount,
  overlay,
} from "../../graphql/reactivities/state";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.cart.product,
      qty:
        cartItems().find((item) => item.product.id === props.cart.product.id)
          .qty || 1,
      galleryIndex: 0,
    };
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
  }

  addQuantity(e, cart) {
    e.preventDefault();
    amount(0);
    let cartItemsTemp = cartItems();
    const cartIndex = cartItems().indexOf(cart);

    cartItemsTemp.splice(cartIndex, 1, {
      product: cart.product,
      attributes: cart.attributes,
      qty: cart.qty + 1,
    });
    cartItems(cartItemsTemp);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
  }

  removeQuantity(e, cart) {
    e.preventDefault();
    if (cart.qty - 1 > 0) {
      e.preventDefault();
      amount(0);
      let cartItemsTemp = cartItems();
      const cartIndex = cartItems().indexOf(cart);

      cartItemsTemp.splice(cartIndex, 1, {
        product: cart.product,
        attributes: cart.attributes,
        qty: cart.qty - 1,
      });
      cartItems(cartItemsTemp);
      localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    } else if (cart.qty - 1 === 0) {
      amount(0);
      let cartItemsTemp = cartItems();
      const cartIndex = cartItems().indexOf(cart);
      cartItemsTemp.splice(cartIndex, 1);
      cartItems(cartItemsTemp);
      localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    }
  }
  galleryIndexUp(e) {
    this.setState((prevState) => ({
      ...prevState,
      galleryIndex:
        prevState.galleryIndex + 1 < this.state.product.gallery.length
          ? prevState.galleryIndex + 1
          : this.state.product.gallery.length - 1,
    }));
  }

  galleryIndexDown(e) {
    this.setState((prevState) => ({
      ...prevState,
      galleryIndex:
        prevState.galleryIndex - 1 > 0 ? prevState.galleryIndex - 1 : 0,
    }));
  }

  render() {
    const product = this.props.cart.product;
    const { currentCurrency } = this.props.getCurrentCurrencyQuery;
    return (
      <Cart overlay={overlay()}>
        <CartDetails overlay={overlay()}>
          <ProductBrand overlay={overlay()}>{product.brand}</ProductBrand>
          <ProductName overlay={overlay()}>{product.name}</ProductName>
          <Price overlay={overlay()}>
            <PriceCurrency>{currentCurrency.symbol}</PriceCurrency>
            <PriceAmount>
              {
                product.prices.find(
                  (price) => price.currency.label === currentCurrency.label
                ).amount
              }
            </PriceAmount>
          </Price>
          <section>
            <AttributesContainer overlay={overlay()}>
              {product.attributes.map((attribute) => {
                return (
                  <AttributesList key={attribute.id} overlay={overlay()}>
                    <AttributeName>
                      {attribute.name.toUpperCase()}:
                    </AttributeName>
                    <AttributeValueContainer overlay={overlay()}>
                      {attribute.type === "swatch" ? (
                        <AttributeValueList overlay={overlay()} swatch={true}>
                          {attribute.items.map((item) => {
                            return (
                              <AttributeValue
                                swatch={true}
                                overlay={overlay()}
                                key={item.id}
                                swatchColor={item.value}
                                isTheAttributeName={
                                  this.props.cart.attributes.length > 0 &&
                                  this.props.cart.attributes.find(
                                    (att) => att.name === attribute.name
                                  )
                                }
                                isTheAttributeId={
                                  this.props.cart.attributes.find(
                                    (att) => att.name === attribute.name
                                  ).id === item.id
                                }
                              ></AttributeValue>
                            );
                          })}
                        </AttributeValueList>
                      ) : (
                        <AttributeValueList overlay={overlay()}>
                          {attribute.items.map((item) => {
                            return (
                              <AttributeValue
                                overlay={overlay()}
                                key={item.id}
                                isTheAttributeName={
                                  this.props.cart.attributes.length > 0 &&
                                  this.props.cart.attributes.find(
                                    (att) => att.name === attribute.name
                                  )
                                }
                                isTheAttributeId={
                                  this.props.cart.attributes.find(
                                    (att) => att.name === attribute.name
                                  ).id === item.id
                                }
                              >
                                <AttributeValueItem overlay={overlay()}>
                                  {item.value}
                                </AttributeValueItem>
                              </AttributeValue>
                            );
                          })}
                        </AttributeValueList>
                      )}
                    </AttributeValueContainer>
                  </AttributesList>
                );
              })}
            </AttributesContainer>
          </section>
        </CartDetails>
        <CartMiddle overlay={overlay()}>
          <CartMiddleOperator overlay={overlay()}>
            <CartButton
              overlay={overlay()}
              onClick={(e) => this.addQuantity(e, this.props.cart)}
            >
              <img
                width='12px'
                height='12px'
                src='assets/icons/plus-line.svg'
                alt='Plus'
              />
            </CartButton>
          </CartMiddleOperator>
          <CartMiddleQty overlay={overlay()}>
            {this.props.cart.qty}
          </CartMiddleQty>
          <CartMiddleOperator overlay={overlay()}>
            <CartButton
              overlay={overlay()}
              onClick={(e) => this.removeQuantity(e, this.props.cart)}
              danger={this.props.cart.qty === 1}
            >
              <img
                width='12px'
                height='12px'
                src='assets/icons/minus-line.svg'
                alt='minus'
              />
            </CartButton>
          </CartMiddleOperator>
        </CartMiddle>
        <Gallery
          overlay={overlay()}
          url={product.gallery[this.state.galleryIndex]}
        >
          <ImageNav overlay={overlay()}>
            <img
              src='assets/icons/leftArrow.svg'
              onClick={(e) => this.galleryIndexDown(e)}
              alt='gallery'
            />
            <img
              src='assets/icons/rightArrow.svg'
              onClick={(e) => this.galleryIndexUp(e)}
              alt='gallery'
            />
          </ImageNav>
        </Gallery>
      </Cart>
    );
  }
}

export default compose(
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" })
)(CartItem);

const Cart = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${(props) => (props.overlay ? "293px" : "1098px")};
  min-height: ${(props) => (props.overlay ? "137px" : "225px")};
  margin-bottom: ${(props) => (props.overlay ? "41px" : "0")};
  padding-top: ${(props) => (props.overlay ? "0" : "20px")};
  padding-bottom: ${(props) => (props.overlay ? "0" : "20px")};
  border-bottom: ${(props) => (props.overlay ? "none" : "2px solid #E5E5E5")};
`;

const CartDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.overlay ? "156px" : "900px")};
  justify-content: flex-start;
`;

const ProductBrand = styled.div`
  font-family: ${(props) =>
    props.overlay ? "Raleway-light" : "Raleway-semibold"};
  font-size: ${(props) => (props.overlay ? "16px" : "30px")};
  font-weight: ${(props) => (props.overlay ? "300" : "600")};
  line-height: ${(props) => (props.overlay ? "25.6px" : "27px")};
  font-height: ${(props) => (props.overlay ? "160%" : "77%")};
  letter-spacing: 0px;
  text-align: left;
  margin-top: ${(props) => (props.overlay ? "5px" : "20px")};
  margin-bottom: ${(props) => (props.overlay ? "2px" : "16px")};
  color: #1d1f22;
`;

const ProductName = styled.div`
  font-family: ${(props) => (props.overlay ? "Raleway-light" : "Raleway")};
  font-size: ${(props) => (props.overlay ? "16px" : "30px")};
  font-weight: ${(props) => (props.overlay ? "300" : "400")};
  line-height: ${(props) => (props.overlay ? "25.6px" : "27px")};
  font-height: ${(props) => (props.overlay ? "160%" : "77%")};
  letter-spacing: 0px;
  text-align: left;
  margin-bottom: ${(props) => (props.overlay ? "5px" : "26px")};
  color: #1d1f22;
`;

const Price = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => (props.overlay ? "27px" : "26px")};
`;

const PriceCurrency = styled.div`
  font-family: ${(props) =>
    props.overlay ? "Raleway-medium" : "Raleway-bold"};
  font-size: ${(props) => (props.overlay ? "16px" : "24px")};
  font-weight: ${(props) => (props.overlay ? "500" : "700")};
  line-height: ${(props) => (props.overlay ? "26px" : "18px")};
  line-height: ${(props) => (props.overlay ? "160%" : "64%")};
  letter-spacing: 0em;
  text-align: right;
`;

const PriceAmount = styled.div`
  font-family: ${(props) =>
    props.overlay ? "Raleway-medium" : "Raleway-bold"};
  font-size: ${(props) => (props.overlay ? "16px" : "24px")};
  font-weight: ${(props) => (props.overlay ? "500" : "700")};
  line-height: ${(props) => (props.overlay ? "25.6px" : "18px")};
  line-height: ${(props) => (props.overlay ? "160%" : "64%")};
  letter-spacing: 0em;
  text-align: right;
`;

const AttributesContainer = styled.div`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  display: flex;
  flex-direction: column;
`;

const AttributesList = styled.li`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  display: flex;
  flex-direction: column;
  margin-bottom: ${(props) => (props.overlay ? "5px" : "16px")};
`;

const AttributeName = styled.div`
  font-family: Roboto-condensed-bold;
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
  line-height: 85%;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 8px;
`;

const AttributeValueContainer = styled.div`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
`;
const AttributeValueList = styled.ul`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 12px;
`;

const AttributeValue = styled.li`
  min-width: ${(props) =>
    props.overlay ? (props.swatch ? "18px" : "24px") : "63px"};
  height: ${(props) => (props.overlay ? "24px" : "45px")};
  display: flex;
  margin-right: 12px;
  cursor: pointer;
  list-style: none;
  align-items: center;
  border: ${(props) =>
    props.swatch
      ? props.isTheAttributeName
        ? props.isTheAttributeId
          ? "2px solid #FA9A53"
          : "1px solid #A6A6A6"
        : ""
      : props.isTheAttributeName
      ? props.isTheAttributeId
        ? props.overlay
          ? " 1px solid #1D1F22"
          : "1px solid #A6A6A6"
        : "1px solid #A6A6A6"
      : ""};
  background-color: ${(props) =>
    props.swatch
      ? props.swatchColor
      : props.isTheAttributeName
      ? props.isTheAttributeId
        ? !props.overlay
          ? "#1D1F22"
          : "var(--c-white)"
        : props.overlay
        ? "rgba(166, 166, 166, 0.2)"
        : "var(--c-white)"
      : ""};
  color: ${(props) =>
    props.isTheAttributeName
      ? props.isTheAttributeId
        ? !props.overlay
          ? "var(--c-white)"
          : "#1D1F22"
        : props.overlay
        ? "#A6A6A6"
        : "#A6A6A6"
      : ""};
`;

const AttributeValueItem = styled.div`
  font-family: Source Sans Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  margin: auto;
`;
const CartMiddle = styled.div`
  width: ${(props) => (props.overlay ? "24px" : "45px")};
  height:  ${(props) => (props.overlay ? "137px" : "185px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CartMiddleQty = styled.div`
font-family: Raleway-medium;
font-size: ${(props) => (props.overlay ? "16px" : "24px")};
font-style: normal;
font-weight: 500;
line-height: ${(props) => (props.overlay ? "26px" : "38px")}; 
line-height: 160%;
letter-spacing: 0em;
text-align: center;
`;

const CartMiddleOperator = styled.div`
  font-family: Raleway;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: center;
  cursor: pointer;
`;

const Gallery = styled.div`
  width: ${(props) => (props.overlay ? "105px" : "141px")};
  height: ${(props) => (props.overlay ? "137px" : "185px")};
  margin-left: ${(props) => (props.overlay ? "10px" : "12px")};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    background-image: ${(props) => `URL(${props.url})`};
    background-size:${props=>props.overlay?"105px auto, cover":"141px auto, cover"} ;
    background-repeat: no-repeat;
    opacity: 0.75;
  }
`;

const ImageNav = styled.div`
  width: ${(props) => (props.overlay ? "105px" : "141px")};
  height: ${(props) => (props.overlay ? "14px" : "24px")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  & img {
    margin-left: 9px;
    margin-right: 9px;
    cursor: pointer;
    color: white;
    mix-blend-mode: difference;
  }
`;

const CartButton = styled.button`
  width: ${(props) => (props.overlay ? "24px" : "45px")};
  height: ${(props) => (props.overlay ? "24px" : "45px")};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--c-white);
  border: ${(props) => (props.danger ? "#ff7800" : "1px solid #1d1f22")};
  background-color: ${(props) => (props.danger ? "#ff7800" : "")};
  color: ${(props) => (props.danger ? "#ff7800" : "")};
`;
