import React, { Component } from "react";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  currentCurrency,
  getCartItemsQuery,
  getCurrentAttributesQuery,
  cartItems,
  amount,
  overlay,
} from "../../graphql/reactivities/state";
import {
  getCategoriesQuery,
  getCurrenciesQuery,
} from "../../graphql/queries/queries";

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.cart.product,
      attributes: [
        ...cartItems().find(
          (item) => item.product.id === this.props.cart.product.id
        ).attributes,
      ],
      qty:
        cartItems().find((item) => item.product.id === props.cart.product.id)
          .qty || 1,
      galleryIndex: 0,
    };
    this.checkAttributes();
    this.addQuantity = this.addQuantity.bind(this);
    this.removeQuantity = this.removeQuantity.bind(this);
  }

  checkAttributes() {
    const cart = cartItems().find(
      (cart) => cart.product.id === this.props.cart.product.id
    );
    if (cart) {
      this.setState((prev) => ({ ...prev, attributes: [...cart.attributes] }));
    } else {
      this.setState((prev) => ({ ...prev, attributes: [] }));
    }
  }

  setAttributes(e, attribute, id, value) {
    e.preventDefault();
    const currentAttributesTemp = this.state.attributes.filter(
      (item) => item.name !== attribute.name
    );
    const cartItemsTemp = cartItems().filter(
      (cart) => cart.product.id !== this.state.product.id
    );

    const cartIndex= cartItems().indexOf(cartItems().find(cart=> cart.product.id === this.state.product.id));
    cartItemsTemp.splice(cartIndex,0,{
      product: this.state.product,
        attributes: [
          ...currentAttributesTemp,
          { name: attribute.name, id, value },
        ],
      qty: this.state.qty,
    })
    cartItems(cartItemsTemp)
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    this.setState((prevState) => ({
      ...prevState,
      attributes: [
        ...currentAttributesTemp,
        { name: attribute.name, id, value },
      ],
    }));
  }

  addQuantity(e) {
    e.preventDefault();
    amount(0);
    let cartItemsTemp = cartItems().filter(
      (cart) => cart.product.id !== this.state.product.id
    );
    const cartIndex= cartItems().indexOf(cartItems().find(cart=> cart.product.id === this.state.product.id));
    cartItemsTemp.splice(cartIndex,0,{
      product: this.state.product,
      attributes: this.state.attributes,
      qty: this.state.qty + 1,
    })
    cartItems(cartItemsTemp)
    localStorage.setItem("cartItems", JSON.stringify(cartItems()));
    this.setState((prevState) => ({
      ...prevState,
      qty: prevState.qty + 1,
    }));
  } 

  removeQuantity(e) {
    e.preventDefault();
    if (this.state.qty - 1 > 0) {
      let cartItemsTemp = cartItems().filter(
        (cart) => cart.product.id !== this.state.product.id
      );
      const cartIndex= cartItems().indexOf(cartItems().find(cart=> cart.product.id === this.state.product.id));
      cartItemsTemp.splice(cartIndex,0,{
        product: this.state.product,
        attributes: this.state.attributes,
        qty: this.state.qty - 1 > 0 ? this.state.qty - 1 : 1,
      })
      cartItems(cartItemsTemp)
      localStorage.setItem("cartItems", JSON.stringify(cartItems()));
      this.setState((prevState) => ({
        ...prevState,
        qty: prevState.qty - 1 > 0 ? prevState.qty - 1 : 1,
      }));
    }else if(this.state.qty - 1=== 0){
      this.setState((prevState) => ({
        ...prevState,
        qty:0,
      }));
      const cartItemsTemp = cartItems().filter(
        (cart) => cart.product.id !== this.state.product.id
      );
      cartItems([...cartItemsTemp])
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
    const product = this.state.product;
    return (
        <Cart overlay={overlay()}>
        <CartDetails overlay={overlay()}>
          <ProductBrand overlay={overlay()}>{product.brand}</ProductBrand>
          <ProductName overlay={overlay()}>{product.name}</ProductName>
          <Price overlay={overlay()}>
            <PriceCurrency>{currentCurrency().symbol}</PriceCurrency>
            <PriceAmount>
              {
                product.prices.find(
                  (price) => price.currency.label === currentCurrency().label
                ).amount
              }
            </PriceAmount>
          </Price>
          <section>
            <AttributesContainer overlay={overlay()}>
              {product.attributes.map((attribute) => {
                return (
                  <Attributes key={attribute.id} overlay={overlay()}>
                    <AttributesContents overlay={overlay()}>
                      {attribute.type === "swatch" ? (
                        <AttributesList overlay={overlay()} swatch={true}>
                          {attribute.items.map((item) => {
                            return (
                              <AttributeValue
                                swatch={true}
                                overlay={overlay()}
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
                                  border:
                                    this.state.attributes.length > 0 &&
                                    this.state.attributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                      ? this.state.attributes.find(
                                          (att) => att.name === attribute.name
                                        ).id === item.id
                                        ? "2px solid #FA9A53"
                                        : "1px solid #A6A6A6"
                                      : "",
                                  backgroundColor: item.value,
                                }}
                             ></AttributeValue>
                            );
                          })}
                        </AttributesList>
                      ) : (
                        <AttributesList overlay={overlay()}>
                          {attribute.items.map((item) => {
                            if (item.id !== "Yes" && item.id !== "No")
                              return (
                                <AttributeValue
                                  overlay={overlay()}
                                  onClick={(e) =>
                                    this.setAttributes(
                                      e,
                                      attribute,
                                      item.id,
                                      item.value
                                    )
                                  }
                                  style={{
                                    color:
                                    this.state.attributes.length > 0 &&
                                    this.state.attributes.find(
                                      (att) => att.name === attribute.name
                                    )
                                      ? this.state.attributes.find(
                                          (att) => att.name === attribute.name
                                        ).id === item.id
                                        ?!overlay()?"var(--c-white)"
                                        :"#1D1F22"
                                      :overlay()?"#A6A6A6": "":"#1D1F22",
                                    backgroundColor:
                                      this.state.attributes.length > 0 &&
                                      this.state.attributes.find(
                                        (att) => att.name === attribute.name
                                      )
                                        ? this.state.attributes.find(
                                            (att) => att.name === attribute.name
                                          ).id === item.id
                                          ?!overlay()?"#1D1F22"
                                          : "var(--c-white)"
                                        :overlay()?"rgba(166, 166, 166, 0.2)": "var(--c-white)":"",
                                        border:
                                        this.state.attributes.length > 0 &&
                                        this.state.attributes.find(
                                          (att) => att.name === attribute.name
                                        )
                                          ? this.state.attributes.find(
                                              (att) => att.name === attribute.name
                                            ).id === item.id
                                            ?overlay()?" 1px solid #1D1F22"
                                            :" 1px solid #A6A6A6"
                                          :" 1px solid #A6A6A6":" 1px solid #A6A6A6",
                                  }}
                                  key={item.id}
                                >
                                  <AttributeValueItem overlay={overlay()}>
                                    {item.value}
                                  </AttributeValueItem>
                                </AttributeValue>
                              );
                            else
                              return (
                                <AttributeCheckbox
                                  overlay={overlay()}
                                  key={item.id}
                                >
                                  {item.id === "Yes" && (
                                    <input
                                      onChange={(e) =>
                                        this.setAttributes(
                                          e,
                                          attribute,
                                          e.target.checked ? "Yes" : "No",
                                          e.target.checked ? "Yes" : "No"
                                        )
                                      }
                                      type='checkbox'
                                      name='attribute.name'
                                      value=''
                                      checked={
                                        this.state.attributes.length > 0 &&
                                        this.state.attributes.find(
                                          (att) => att.name === attribute.name
                                        )
                                          ? this.state.attributes.find(
                                              (att) =>
                                                att.name === attribute.name
                                            ).id === item.id
                                            ? true
                                            : false
                                          : false
                                      }
                                    />
                                  )}

                                  {item.id === "Yes" && (
                                    <AttributeCheckboxName overlay={overlay()}>
                                      {attribute.name}
                                    </AttributeCheckboxName>
                                  )}
                                </AttributeCheckbox>
                              );
                          })}
                        </AttributesList>
                      )}
                    </AttributesContents>
                  </Attributes>
                );
              })}
            </AttributesContainer>
          </section>
        </CartDetails>
        <CartRight>
          <CartMiddle overlay={overlay()}>
            <CartMiddleOperator overlay={overlay()}>
              <CartButton overlay={overlay()} onClick={this.addQuantity}>
                <img width="12px" height="12px" src="assets/icons/plus-line.svg" alt="Plus"/>
              </CartButton>
            </CartMiddleOperator>
            <CartMiddleQty overlay={overlay()}>{this.state.qty}</CartMiddleQty>
            <CartMiddleOperator overlay={overlay()}>
              <CartButton overlay={overlay()} onClick={this.removeQuantity} 
              style={{backgroundColor:this.state.qty===1?"#ff7800":"",border:this.state.qty===1?"#ff7800":""}}>
              <img width="12px" height="12px" src="assets/icons/minus-line.svg" alt="minus"/>
              </CartButton>
            </CartMiddleOperator>
          </CartMiddle>
          <ImageContainer overlay={overlay()}>
            <Image
              width={`${overlay() ? "105px" : "141px"}`}
              height={`${overlay() ? "137px" : "185px"}`}
              overlay={overlay()}
              srcSet={product.gallery[this.state.galleryIndex]}
              alt='gallery'
            />
            <ImageNav overlay={overlay()}>
              <Image
                width='8px'
                height='14px'
                srcSet='assets/icons/leftArrow.svg'
                onClick={(e) => this.galleryIndexDown(e)}
                alt='gallery'
              />
              <Image
                width='8px'
                height='14px'
                srcSet='assets/icons/rightArrow.svg'
                onClick={(e) => this.galleryIndexUp(e)}
                alt='gallery'
              />
            </ImageNav>
          </ImageContainer>
        </CartRight>
      </Cart>
 
    
        );
  }
}

export default compose(
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" }),
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCartItemsQuery, { name: "getCartItemsQuery" }),
  graphql(getCurrentAttributesQuery, { name: "getCurrentAttributesQuery" })
)(CartItem);


const Cart = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.overlay ? "293px" : "1098px")};
  /* height:${(props) => (props.overlay ? "137px" : "225px")}; */
  margin: auto;
  margin-bottom: ${(props) => (props.overlay ? "41px" : "0")};
  padding-top: ${(props) => (props.overlay ? "0" : "20px")};
  padding-bottom: ${(props) => (props.overlay ? "0" : "20px")};
  border-bottom: ${(props) => (props.overlay ? "none" : "2px solid #E5E5E5")};
`;

const CartDetails = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  justify-content: flex-start;
`;

const ProductBrand = styled.div`
  font-family:${props=>props.overlay?"Raleway-light":"Raleway-semibold"};
  font-size: ${(props) => (props.overlay ? "16px" : "30px")};
  font-weight: ${(props) => (props.overlay ? "300" : "600")};
  line-height: ${(props) => (props.overlay ? "25.6px" : "27px")};
  font-height:${props=>props.overlay ? "160%":"77%"};
  letter-spacing: 0px;
  text-align: left;
  margin-top: ${(props) => (props.overlay ? "5px" : "20px")};
  margin-bottom: ${(props) => (props.overlay ? "2px" : "16px")};
  color:#1D1F22;
`;

const ProductName = styled.div`
font-family:${props=>props.overlay?"Raleway-light":"Raleway"};
font-size: ${(props) => (props.overlay ? "16px" : "30px")};
font-weight: ${(props) => (props.overlay ? "300" : "400")};
line-height: ${(props) => (props.overlay ? "25.6px" : "27px")};
font-height:${props=>props.overlay ? "160%":"77%"};
letter-spacing: 0px;
text-align: left;
margin-bottom: ${(props) => (props.overlay ? "5px" : "26px")};
color:#1D1F22;
`;

const Price = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => (props.overlay ? "27px" : "26px")};
`;

const PriceCurrency = styled.div`
font-family:${(props) => (props.overlay ? "Raleway-medium" : "Raleway-bold")};
font-size:${(props) => (props.overlay ? "16px" : "24px")};
font-weight:${(props) => (props.overlay ? "500" : "700")};
line-height:${(props) => (props.overlay ? "26px" : "18px")};
line-height:${(props) => (props.overlay ? "160%" : "64%")};
letter-spacing: 0em;
text-align: right;

`;

const PriceAmount = styled.div`
font-family:${(props) => (props.overlay ? "Raleway-medium" : "Raleway-bold")};
font-size:${(props) => (props.overlay ? "16px" : "24px")};
font-weight:${(props) => (props.overlay ? "500" : "700")};
line-height:${(props) => (props.overlay ? "25.6px" : "18px")};
line-height:${(props) => (props.overlay ? "160%" : "64%")};
letter-spacing: 0em;
text-align: right;
`;

const AttributesContainer = styled.div`
 width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  display: flex;
  flex-direction: column;
`;

const Attributes = styled.li`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
  display: flex;
  flex-direction: column;
  margin-bottom:${(props) => (props.overlay ? "5px" : "16px")};
`;

const AttributesContents = styled.div`
  width: ${(props) => (props.overlay ? "146.5px" : "900px")};
`;
const AttributesList = styled.ul`
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
const AttributeCheckbox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & input {
    margin-right: 4px;
  }
`;
const AttributeCheckboxName = styled.div`
  font-family: Source Sans Pro;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: center;
  margin: 0;
  padding: 0;
`;

const CartRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.overlay ? "139px" : "198px")};
  /* height:${(props) => (props.overlay ? "137px" : "185px")}; */
  height: 100%;
  vertical-align: middle;
`;

const CartMiddle = styled.div`
  width: ${(props) => (props.overlay ? "24px" : "45px")};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const CartMiddleQty = styled.div`
  margin-top: ${(props) => (props.overlay ? "34px" : "36px")};
  margin-bottom: ${(props) => (props.overlay ? "34px" : "36px")};
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

const ImageContainer = styled.div`
  width: ${(props) => (props.overlay ? "105px" : "141px")};
  height: ${(props) => (props.overlay ? "137px" : "185px")};
  overflow: hidden;
  object-fit: contain;
  margin-left: ${(props) => (props.overlay ? "10px" : "12px")};
`;

const Image = styled.img``;
const ImageNav = styled.div`
  position: relative;
  top: ${(props) => (props.overlay ? "-80px" : "-102px")};
  left: 0;
  width: ${(props) => (props.overlay ? "105px" : "141px")};
  height: ${(props) => (props.overlay ? "14px" : "24px")};
  background: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  & img {
    margin-left: 9px;
    margin-right: 9px;
    cursor: pointer;
    color:white;
    mix-blend-mode:difference;
  }
`;

const CartButton = styled.button`
  width: ${(props) => (props.overlay ? "24px" : "45px")};
  height: ${(props) => (props.overlay ? "24px" : "45px")};
  display:flex;
  justify-content: center;
  align-items: center;
  background-color:var(--c-white);
  border:1px solid #1D1F22;
`;
