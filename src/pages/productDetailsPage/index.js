import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  getCurrentProductQuery,
  getCurrentProductDetailsImageQuery,
  getOverlayQuery,
  currentProduct,
  getCurrentAttributesQuery,
  currentProductDetailsImage,
  overlay,
  cartItems,
  articleCount,
  currentAttributes,
} from "../../graphql/reactivities/state";
import {
  getCategoriesQuery,
  getCurrenciesQuery,
} from "../../graphql/queries/queries";

import Layout from "../../components/layout/Layout";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.removeFromCart = this.removeFromCart.bind(this);
    this.checkAttributes();
  }
  changeImage(im) {
    currentProductDetailsImage(im);
    localStorage.setItem(
      "currentProductDetailsImage",
      JSON.stringify(currentProductDetailsImage())
    );
  }

  printDescription() {
    const product = currentProduct();
    return product.description;
  }

  setAttributes(e, attribute, id, value) {
    e.preventDefault();
    const currentAttributesTemp = currentAttributes().filter(
      (item) => item.name !== attribute.name
    );
    currentAttributes([
      ...currentAttributesTemp,
      { name: attribute.name, id, value },
    ]);
    localStorage.setItem(
      "currentAttributes",
      JSON.stringify(currentAttributes())
    );
  }

  addToCart(product, attributes) {
    const cart = cartItems().find(
      (cart) => cart.product.id === currentProduct().id
    );
    if (cart) {
      const carteItemsTemps = cartItems().filter(
        (item) => item.product.id !== product.id
      );
      cartItems([...carteItemsTemps, { product, attributes, qty: cart.qty }]);
      overlay(false);
      currentAttributes([]);
      localStorage.setItem("cartItems", JSON.stringify(cartItems()));
      localStorage.setItem("overlay", JSON.stringify(overlay()));
      localStorage.setItem("articleCount", JSON.stringify(articleCount()));
      localStorage.setItem(
        "currentAttributes",
        JSON.stringify(currentAttributes())
      );
    } else {
      cartItems([...cartItems(), { product, attributes, qty: 1 }]);
      overlay(false);
      articleCount(articleCount() + 1);
      currentAttributes([]);
      localStorage.setItem("cartItems", JSON.stringify(cartItems()));
      localStorage.setItem("overlay", JSON.stringify(overlay()));
      localStorage.setItem("articleCount", JSON.stringify(articleCount()));
      localStorage.setItem(
        "currentAttributes",
        JSON.stringify(currentAttributes())
      );
    }
    currentProductDetailsImage("")
    localStorage.setItem("currentProductDetailsImage", JSON.stringify(currentProductDetailsImage()));
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
    articleCount(
      articleCount() -
        cartItems().find((cart) => cart.product.id === product.id).qty
    );
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
    const cartItemsTemp = cartItems().filter(
      (cart) => cart.product.id !== product.id
    );
    cartItems(cartItemsTemp);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
  }

  render() {
    const { currentProduct: product } = this.props.getCurrentProductQuery;
    const { currentCurrency: currency } = this.props.getCurrentCurrencyQuery;
    const currentAttributes =
      this.props.getCurrentAttributesQuery.currentAttributes;

    console.log(product);
    console.log(currentAttributes);
    return (
      <Layout>
        <Details>
          <GalleryContainer>
            {product.gallery.map((im) => {
              return (
                <Gallery
                  key={im}
                  onClick={(e) => {
                    this.changeImage(im);
                  }}
                >
                  <GalleryImage
                    width='79px'
                    height='80px'
                    srcSet={im}
                    alt='gallery'
                  />
                </Gallery>
              );
            })}
          </GalleryContainer>
          <DetailsContainer>
            <ImageContainer>
              <Image
                width='610px'
                height='511px'
                srcSet={currentProductDetailsImage() || product.gallery[0]}
                alt='gallery'
              />
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
                                  style={{
                                    width: "54px",
                                    height: "45px",
                                    border:
                                      currentAttributes.length > 0 &&
                                      currentAttributes.find(
                                        (att) => att.name === attribute.name
                                      )
                                        ? currentAttributes.find(
                                            (att) => att.name === attribute.name
                                          ).id === item.id
                                          ? "2px solid #FA9A53"
                                          : "1px solid #A6A6A6"
                                        : "1px solid #A6A6A6",
                                    backgroundColor: item.value,
                                  }}
                                ></AttributeValue>
                              );
                            })}
                          </AttributeValueList>
                        ) : (
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
                                  style={{
                                    display: "flex",
                                    width: "63px",
                                    height: "45px",
                                    border: " 1px solid #A6A6A6",
                                    color:
                                      currentAttributes.length > 0 &&
                                      currentAttributes.find(
                                        (att) => att.name === attribute.name
                                      )
                                        ? currentAttributes.find(
                                            (att) => att.name === attribute.name
                                          ).id === item.id
                                          ? "var(--c-white)"
                                          : "#1D1F22"
                                        : "",
                                    background:
                                      currentAttributes.length > 0 &&
                                      currentAttributes.find(
                                        (att) => att.name === attribute.name
                                      )
                                        ? currentAttributes.find(
                                            (att) => att.name === attribute.name
                                          ).id === item.id
                                          ? "#1D1F22"
                                          : "var(--c-white)"
                                        : "",
                                  }}
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
                <PriceTitle>
                  PRICE:
                </PriceTitle>
                <PriceValue>
                  {currency.symbol}
                  {
                    product.prices.find(
                      (price) => price.currency.label === currency.label
                    ).amount
                  }
                </PriceValue>
              </Price>
              <Link
                to={`${
                  product.attributes.length === currentAttributes.length
                    ? "/products"
                    : "/product"
                }`}
                disabled={true}
              >
                <StyledButton
                  onClick={() => {
                    if (
                      product.attributes.length === currentAttributes.length
                    ) {
                      this.addToCart(product, currentAttributes);
                    }
                  }}
                >
                  {cartItems().find(
                    (cart) => cart.product.id === currentProduct().id
                  )
                    ? "SAVE CHANGE"
                    : "ADD TO CART"}
                </StyledButton>
              </Link>

              {cartItems().find(
                (cart) => cart.product.id === currentProduct().id
              ) ? (
                <Link to='/products'>
                  <StyledButton
                    onClick={() => this.removeFromCart(product)}
                    removing='true'
                  >
                    REMOVE FROM CART
                  </StyledButton>
                </Link>
              ) : null}
              <Description
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </Content>
          </DetailsContainer>
          <GalleryContainer></GalleryContainer>
        </Details>
      </Layout>
    );
  }
}

export default compose(
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" }),
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCurrentProductQuery, { name: "getCurrentProductQuery" }),
  graphql(getCurrentAttributesQuery, { name: "getCurrentAttributesQuery" }),
  graphql(getCurrentProductDetailsImageQuery, {
    name: "getCurrentProductDetailsImageQueryy",
  }),
  graphql(getOverlayQuery, { name: "getCartItemsQuery" })
)(ProductDetails);

const Details = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 1440px;
  height: 745px;
  margin: auto;
  margin-top: 80px;
`;

const GalleryContainer = styled.ul`
  margin: 0;
  width: 79px;
`;

const Gallery = styled.li`
  margin-bottom: 40px;
  object-fit: contain;
  width: 79px;
  height: 80px;
  cursor: pointer;
  list-style: none;
`;

const GalleryImage = styled.img``;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  width: auto;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  width: auto;
`;

const Image = styled.img`
  margin-left: 40px;
  margin-right: 100px;
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
  margin-right: 12px;
  cursor: pointer;
  list-style: none;
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
background-color:${(props) =>
  props.removing ? "#ff7800" : "var(--c-primary)"};
color: var(--c-white);
border:0;
margin-bottom:40px;
cursor:pointer;
}

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
