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
  currentCurrency,
  currentProduct,
  currentProductDetailsImage,
  overlay,
  cartItems,
  articleCount,
} from "../../graphql/reactivities/state";
import {
  getCategoriesQuery,
  getCurrenciesQuery,
} from "../../graphql/queries/queries";

import Layout from "../../components/layout/Layout";

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: cartItems(),
      attributes: cartItems.attributes ? cartItems.attributes : {},
      inCart: cartItems.inCart ? cartItems.inCart : false,
    };
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
    this.setState((prevState) => ({
      ...prevState,
      attributes: { ...prevState.attributes, [attribute]: { id, value } },
    }));
  }

  addToCart(product, attributes) {
    cartItems([...cartItems(), { product, attributes, qty: 1 }]);
    overlay(false);
    articleCount(articleCount()+1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    localStorage.setItem("overlay", JSON.stringify(overlay()));
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
  }

  render() {
    const product = currentProduct();
    const currency = currentCurrency();
    return (
      <Layout>
        <StyledProductDetails>
          <StyledProductGalleryContainer>
            {product.gallery.map((im) => {
              return (
                <StyledProductGallery
                  key={im}
                  onClick={(e) => {
                    this.changeImage(im);
                  }}
                >
                  <StyledProductGalleryImage
                    width='79px'
                    height='80px'
                    srcSet={im}
                    alt='gallery'
                  />
                </StyledProductGallery>
              );
            })}
          </StyledProductGalleryContainer>
          <StyledProductDetailsContainer>
            <StyledProductDetailsImageContainer>
              <StyledProductDetailsImage
                width='610px'
                height='511px'
                srcSet={currentProductDetailsImage() || product.gallery[0]}
                alt='gallery'
              />
            </StyledProductDetailsImageContainer>
            <StyledProductDetailsContent>
              <StyledProductName>{product.name}</StyledProductName>
              <StyledproductDetailsAttributesContainer>
                {product.attributes.map((attribute) => {
                  return (
                    <StyledProductDetailsAttributesList key={attribute.id}>
                      <StyledProductDetailsAttributeName>
                        {attribute.name.toUpperCase()}:
                      </StyledProductDetailsAttributeName>
                      <StyledProductDetailsContentAttributeValueContainer>
                        {attribute.type === "swatch" ? (
                          <StyledProductDetailsContentAttributeValueList>
                            {attribute.items.map((item) => {
                              return (
                                <StyledProductDetailsContentAttributeValue
                                  onClick={(e) =>
                                    this.setAttributes(
                                      e,
                                      attribute.name,
                                      item.id,
                                      item.value
                                    )
                                  }
                                  key={item.id}
                                  style={{
                                    width: "63px",
                                    height:
                                      this.state.attributes[attribute.name] &&
                                      this.state.attributes[attribute.name][
                                        "id"
                                      ] === item.id
                                        ? "60px"
                                        : "45px",
                                    backgroundColor: item.value,
                                  }}
                                ></StyledProductDetailsContentAttributeValue>
                              );
                            })}
                          </StyledProductDetailsContentAttributeValueList>
                        ) : (
                          <StyledProductDetailsContentAttributeValueList>
                            {attribute.items.map((item) => {
                              return (
                                <StyledProductDetailsContentAttributeValue
                                  onClick={(e) =>
                                    this.setAttributes(
                                      e,
                                      attribute.name,
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
                                      this.state.attributes[attribute.name] &&
                                      this.state.attributes[attribute.name][
                                        "id"
                                      ] === item.id
                                        ? "var(--c-white)"
                                        : "#1D1F22",
                                    backgroundColor:
                                      this.state.attributes[attribute.name] &&
                                      this.state.attributes[attribute.name][
                                        "id"
                                      ] === item.id
                                        ? "#1D1F22"
                                        : "var(--c-white)",
                                  }}
                                  key={item.id}
                                >
                                  <StyleProductDetailsContentAttributeValueItem>
                                    {item.value}
                                  </StyleProductDetailsContentAttributeValueItem>
                                </StyledProductDetailsContentAttributeValue>
                              );
                            })}
                          </StyledProductDetailsContentAttributeValueList>
                        )}
                      </StyledProductDetailsContentAttributeValueContainer>
                    </StyledProductDetailsAttributesList>
                  );
                })}
              </StyledproductDetailsAttributesContainer>
              <StyledProductDetailsPrice>
                <StyleProductDetailsContentPriceTitle>
                  PRICE
                </StyleProductDetailsContentPriceTitle>
                <StyledProductDetailsContentPriceValue>
                  {currency.symbol}{" "}
                  {
                    product.prices.find(
                      (price) => price.currency.label === currency.label
                    ).amount
                  }
                </StyledProductDetailsContentPriceValue>
              </StyledProductDetailsPrice>
              <Link to='/products'>
                <StyledButton
                  onClick={() => this.addToCart(product, this.state.attributes)}
                >
                  ADD TO CART
                </StyledButton>
              </Link>
              <StyledProductDetailsDescription
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </StyledProductDetailsContent>
          </StyledProductDetailsContainer>
          <StyledProductGalleryContainer></StyledProductGalleryContainer>
        </StyledProductDetails>
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
  graphql(getCurrentProductDetailsImageQuery, {
    name: "getCurrentProductDetailsImageQueryy",
  }),
  graphql(getOverlayQuery, { name: "getCartItemsQuery" })
)(ProductDetails);

const StyledProductDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 1440px;
  height: 740px;
`;

const StyledProductGalleryContainer = styled.ul`
  margin: 0;
  width: 79px;
  height: 560px;
`;

const StyledProductGallery = styled.li`
  margin-bottom: 40px;
  width: 79px;
  height: 80px;
  cursor: pointer;
  list-style: none;
`;

const StyledProductGalleryImage = styled.img`
  overflow: hidden;
  object-fit: contain;
  opacity: 80%;
`;

const StyledProductDetailsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  width: auto;
`;

const StyledProductDetailsImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  width: auto;
`;

const StyledProductDetailsImage = styled.img`
  margin-left: 40px;
  margin-top: 48.59px;
  margin-right: 100px;
`;

const StyledProductDetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 292px;
`;

const StyledProductName = styled.div`
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 43px;
`;

const StyledproductDetailsAttributesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledProductDetailsAttributesList = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  style-list: none;
`;

const StyledProductDetailsAttributeName = styled.div`
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: center;
  margin-bottom: 8px;
`;

const StyledProductDetailsContentAttributeValueContainer = styled.div``;

const StyledProductDetailsContentAttributeValueList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const StyledProductDetailsContentAttributeValue = styled.li`
  margin-right: 12px;
  cursor: pointer;
  list-style: none;
`;

const StyleProductDetailsContentAttributeValueItem = styled.div`
  padding: 0;
  margin: auto;
`;

const StyledProductDetailsPrice = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyleProductDetailsContentPriceTitle = styled.p`
  margin: 0;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 10px;
`;

const StyledProductDetailsContentPriceValue = styled.p`
  font-family: Raleway;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 20px;
`;
const StyledButton = styled.button`
width: 292px;
height:52px;
font-family: Raleway;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 19px;
letter-spacing: 0em;
text-align: center;
background-color:var(--c-primary);
color: var(--c-white);
border:0;
margin-bottom:40px;
cursor:pointer;
}

`;

const StyledProductDetailsDescription = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  max-height: 350px;
  width: 292px;
`;
