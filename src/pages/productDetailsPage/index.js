import React, { Component } from "react";
import styled from "styled-components";
import parse from "html-react-parser";

import _ from "lodash";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCurrentProductQuery,
  getCurrentProductDetailsImageQuery,
  getCurrentAttributesQuery,
  getIsActiveAttributesQuery,
  currentProduct,
  currentProductDetailsImage,
  currentAttributes,
  isActiveAttributes,
  overlay,
  cartItems,
  articleCount,
} from "../../graphql/reactivities/state";

import Layout from "../../components/layout/Layout";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkAttributes();
    this.removeFromCart = this.removeFromCart.bind(this);
    currentProductDetailsImage("");
    localStorage.setItem(
      "currentProductDetailsImage",
      JSON.stringify(currentProductDetailsImage())
    );
  }
  changeImage(im) {
    currentProductDetailsImage(im);
    localStorage.setItem(
      "currentProductDetailsImage",
      JSON.stringify(currentProductDetailsImage())
    );
  }

  setAttributes(e, attribute, id, value) {
    e.preventDefault();
    const currentAttributesTemp = currentAttributes().filter(
      (item) => item.name !== attribute.name
    );

    const attributeIndex = currentAttributes().indexOf(
      currentAttributes().find((item) => item.name === attribute.name)
    );
    currentAttributesTemp.splice(attributeIndex, 0, {
      name: attribute.name,
      id,
      value,
    });

    currentAttributes(currentAttributesTemp);
    localStorage.setItem(
      "currentAttributes",
      JSON.stringify(currentAttributes())
    );
  }

  addToCart(product, attributes) {
    cartItems([...cartItems(), { product, attributes, qty: 1 }]);
    overlay(false);
    articleCount(articleCount() + 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    localStorage.setItem("overlay", JSON.stringify(overlay()));
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
    this.isActiveAttributesCheck(product);
  }

  isActiveAttributesCheck(product) {
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
        _.isEqual(sortObject(currentAttributes()), sortObject(cart.attributes))
    );
    if (carts.length > 0) isActiveAttributes(true);
    else isActiveAttributes(false);
    localStorage.setItem(
      "isActiveAttributes",
      JSON.stringify(isActiveAttributes())
    );
  }

  checkAttributes() {
    const cart = cartItems().find(
      (cart) => cart.product.id === currentProduct().id
    );
    if (cart) {
      currentAttributes([...cart.attributes]);
      localStorage.setItem(
        "currentAttributes",
        JSON.stringify(currentAttributes())
      );
    } else {
      currentAttributes([]);
      localStorage.setItem(
        "currentAttributes",
        JSON.stringify(currentAttributes())
      );
    }
  }

  removeFromCart(product) {
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
        _.isEqual(sortObject(currentAttributes()), sortObject(cart.attributes))
    );
    let cartItemsTemp = cartItems();
    const index = cartItems().indexOf(carts[0]);
    cartItemsTemp.splice(index, 1);
    cartItems(cartItemsTemp);
    articleCount(articleCount() - carts[0].qty);
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    this.isActiveAttributesCheck(product);
  }

  render() {
    const { currentProduct: product } = this.props.getCurrentProductQuery;
    const { currentCurrency: currency } = this.props.getCurrentCurrencyQuery;
    const { currentProductDetailsImage } =
      this.props.getCurrentProductDetailsImageQuery;
    const { currentAttributes } = this.props.getCurrentAttributesQuery;
    this.isActiveAttributesCheck(product);
    const { isActiveAttributes } = this.props.getIsActiveAttributesQuery;
    return (
      <Layout>
        <Details>
          <GalleryContainer>
            {product.gallery.map((im) => {
              return (
                <Gallery
                  key={im}
                  url={im}
                  onClick={(e) => {
                    this.changeImage(im);
                  }}
                >
                  {/*                   <GalleryImage
                    width='79px'
                    height='80px'
                    srcSet={im}
                    alt='gallery'
                  /> */}
                </Gallery>
              );
            })}
          </GalleryContainer>
          <DetailsContainer>
            <ImageContainer
              url={currentProductDetailsImage || product.gallery[0]}
            >
              {/*               <Image
                srcSet={currentProductDetailsImage() || product.gallery[0]}
                alt='gallery'
              /> */}
            </ImageContainer>
            <Content>
              <Brand>{product.brand}</Brand>
              <ProductName>{product.name}</ProductName>
              <AttributesContainer>
                {product.attributes.map((attribute) => {
                  return (
                    <AttributesList key={attribute.id}>
                      <AttributeName>
                        {attribute.name.toUpperCase()}:
                      </AttributeName>
                      <AttributeValueContainer>
                        {attribute.type === "swatch" ? (
                          <AttributeValueList>
                            {attribute.items.map((item) => {
                              return (
                                <AttributeValue
                                  onClick={(e) =>
                                    this.setAttributes(
                                      e,
                                      attribute,
                                      item.id,
                                      item.value
                                    )
                                  }
                                  key={item.id}
                                  swatch={true}
                                  swatchColor={item.value}
                                  isTheAttributeName={
                                    currentAttributes.length > 0 &&
                                    currentAttributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                  }
                                  isTheAttributeId={
                                    currentAttributes.length > 0 &&
                                    currentAttributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                      ? currentAttributes.find(
                                          (att) => att.name === attribute.name
                                        ).id === item.id
                                      : false
                                  }
                                ></AttributeValue>
                              );
                            })}
                          </AttributeValueList>
                        ) : (
                          <AttributeValueList>
                            {attribute.items.map((item) => {
                              return (
                                <AttributeValue
                                  onClick={(e) => {
                                    this.setAttributes(
                                      e,
                                      attribute,
                                      item.id,
                                      item.value
                                    );
                                    this.isActiveAttributesCheck(product);
                                  }}
                                  isTheAttributeName={
                                    currentAttributes.length > 0 &&
                                    currentAttributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                  }
                                  isTheAttributeId={
                                    currentAttributes.length > 0 &&
                                    currentAttributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                      ? currentAttributes.find(
                                          (att) => att.name === attribute.name
                                        ).id === item.id
                                      : false
                                  }

                                  key={item.id}
                                >
                                  <AttributeValueItem>
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
              <Price>
                <PriceTitle>PRICE:</PriceTitle>
                <PriceValue>
                  {currency.symbol}
                  {
                    product.prices.find(
                      (price) => price.currency.label === currency.label
                    ).amount
                  }
                </PriceValue>
              </Price>

              {product.inStock ? (
                <StyledButton
                  onClick={() => {
                    if (
                      (product.attributes.length === currentAttributes.length &&
                        !isActiveAttributes &&
                        product.inStock) ||
                      product.attributes === []
                    ) {
                      this.addToCart(product, currentAttributes);
                    } else {
                      this.removeFromCart(product);
                    }
                  }}
                  danger={isActiveAttributes || !product.inStock ? true : false}
                >
                  {isActiveAttributes ? "REMOVE FROM CART" : "ADD TO CART"}
                </StyledButton>
              ) : (
                <OutOfStock>THIS PRODUCT IS OUT OF STOCK</OutOfStock>
              )}

              <Description>{parse(product.description)}</Description>
            </Content>
          </DetailsContainer>
          <GalleryContainer></GalleryContainer>
        </Details>
      </Layout>
    );
  }
}

export default compose(
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentProductQuery, { name: "getCurrentProductQuery" }),
  graphql(getCurrentAttributesQuery, { name: "getCurrentAttributesQuery" }),
  graphql(getCurrentProductDetailsImageQuery, {
    name: "getCurrentProductDetailsImageQuery",
  }),
  graphql(getIsActiveAttributesQuery, { name: "getIsActiveAttributesQuery" })
)(ProductDetails);

const Details = styled.div`
  display: flex;
  flex-direction: row;
  width: 1440px;
  height: 745px;
  margin: auto;
  margin-top: 80px;
  padding-left: 116px;
`;

const GalleryContainer = styled.ul`
  margin: 0;
  width: 79px;
`;

const Gallery = styled.div`
  cursor: pointer;
  list-style: none;
  width: 79px;
  height: 80px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 40px;
  &:before {
    content: "";
    position: absolute;
    top: -7.61px;
    right: -3.29px;
    bottom: -7.61px;
    left: -3.29px;
    background-image: ${(props) => `URL(${props.url})`};
    background-size: 79px auto, cover;
    background-repeat: no-repeat;
  }
`;


const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  width: auto;
`;

const ImageContainer = styled.div`
  width: 610px;
  height: 511px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-left: 40px;
  margin-right: 100px;
  &:before {
    content: "";
    position: absolute;
    top: -48.59px;
    right: -25.42px;
    bottom: -48.59px;
    left: -25.42px;
    background-image: ${(props) => `URL(${props.url})`};
    background-size: 610px auto, cover;
    background-repeat: no-repeat;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 292px;
`;

const Brand = styled.div`
  font-family: Raleway-semibold;
  font-size: 30px;
  font-style: normal;
  font-weight: 600;
  line-height: 27px;
  line-height: 77%;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 16px;
`;

const ProductName = styled.div`
  padding: 0;
  margin: 0;
  font-family: Raleway;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  line-height: 77%;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 43px;
`;

const AttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const AttributesList = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  style-list: none;
`;

const AttributeName = styled.div`
  font-family: Roboto-condensed-bold;
  font-size: 18px;
  font-weight: 700;
  line-height: 18px;
  line-height: 85%;
  letter-spacing: 0em;
  text-align: center;
  margin-bottom: 8px;
`;

const AttributeValueContainer = styled.div``;

const AttributeValueList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const AttributeValue = styled.li`
  display: flex;
  margin-right: 12px;
  cursor: pointer;
  list-style: none;
  width: ${(props) => (props.swatch ? "54px" : "63px")};
  border: ${(props) =>
    props.swatch
      ? props.isTheAttributeName
        ? props.isTheAttributeId
          ? "2px solid #FA9A53"
          : "1px solid #A6A6A6"
        : "1px solid #A6A6A6"
      : " 1px solid #A6A6A6"};
  height: 45px;
  background-color: ${(props) =>
    props.swatch
      ? props.swatchColor
      : props.isTheAttributeName
      ? props.isTheAttributeId
        ? "#1D1F22"
        : "var(--c-white)"
      : ""};
  color:${props=>props.isTheAttributeName?props.isTheAttributeId? "var(--c-white)": "#1D1F22":""}
`;

const AttributeValueItem = styled.div`
  padding: 0;
  margin: auto;
  font-family: Source Sans Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.05em;
  text-align: center;
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceTitle = styled.p`
  margin: 0;
  font-family: Roboto-condensed-bold;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  line-height: 88%;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 10px;
`;

const PriceValue = styled.p`
  width: auto;
  height: 46px;
  font-family: Raleway-bold;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  line-height: 64%;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 20px;
`;
const StyledButton = styled.button`
width: 292px;
height:52px;
font-family: Raleway-semibold;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 19.2px;
line-height: 120%px;
letter-spacing: 0em;
text-align: center;
background-color:${(props) => (props.danger ? "#ff7800" : "var(--c-primary)")};
color: var(--c-white);
border:0;
margin-bottom:40px;
cursor:pointer;
}
`;
const OutOfStock = styled.div`
  font-family: Raleway-semibold;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 19.2px;
  line-height: 120%px;
  letter-spacing: 0em;
  text-align: center;
  margin-bottom: 40px;
  color: #ff7800;
`;

const Description = styled.div`
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25.59px;
  line-height: 159.96%;
  letter-spacing: 0em;
  text-align: left;
  width: 292px;
`;
