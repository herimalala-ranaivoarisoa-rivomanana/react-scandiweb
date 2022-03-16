import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import { getCategoriesQuery } from "../../../graphql/queries/queries";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  getCartItemsQuery,
  getOverlayQuery,
  getOpenCurrencyQuery,
  getArticleCountQuery,
  overlay,
  openCurrency,
  currentCategory,
  currentAttributes,
  cartItems
} from "../../../graphql/reactivities/state";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.viewCartOverlay = this.viewCartOverlay.bind(this);
    this.viewCurrency = this.viewCurrency.bind(this);
  }

  displayCategories() {
    var data = this.props.getCategoriesQuery;
    if (data.categories && data.categories.length > 0)
      return (
        <CategoriesList>
          {data.categories.map((category) => {
            const active = currentCategory() === category.name ? true : false;
            return (
              <Link
                style={{ textDecoration: "none" }}
                to='/products'
                key={category.name}
              >
                <CategoriesListItem
                  active={active}
                  onClick={(e) => this.setCategory(category.name)}
                >
                  {category.name.toUpperCase()}
                </CategoriesListItem>
              </Link>
            );
          })}
        </CategoriesList>
      );
  }

  setCategory(name) {
    currentCategory(name);
    localStorage.setItem("currentCategory", JSON.stringify(name));
    currentAttributes([])
    localStorage.setItem("currentAttributes", JSON.stringify(currentAttributes()));
  }

  viewCartOverlay() {
    overlay(true);
    localStorage.setItem("overlay",overlay());
    currentAttributes([])
    localStorage.setItem("currentAttributes", JSON.stringify(currentAttributes()));
  }

  viewCurrency() {
    openCurrency(true);
    localStorage.setItem("openCurrency", openCurrency());
  }

  render() {
    const { articleCount } = this.props.getArticlaCountQuery;
    const { currentCurrency } = this.props.getCurrentCurrencyQuery;
    return (
      <Navbar>
        <Categories>{this.displayCategories()}</Categories>
        <Alogo>
          <img
            width='31.18px'
            height='29.93px'
            srcSet='assets/icons/logo.svg'
            alt='brand logo'
          />
        </Alogo>
        <ActionContainer>
          <Action>
            <CurrencySwitcher onClick={this.viewCurrency}>
              <Symbol>{currentCurrency.symbol}</Symbol>
              <img
                width='6px'
                height='3px'
                src={`${openCurrency()?'assets/icons/upArrow.svg':'assets/icons/downArrow.svg'}`}
                alt='downArrowIcon'
              />
            </CurrencySwitcher>
            <Link to='/'>
              <CartIcon onClick={cartItems().length>0?this.viewCartOverlay:null}>
                <img
                  width='20px'
                  height='20px'
                  src='assets/icons/cart/emptycart0.svg'
                  alt='downArrowIcon'
                />
              </CartIcon>
            </Link>
          </Action>
         {articleCount>0 && <Counter>{articleCount}</Counter>}
        </ActionContainer>
      </Navbar>
    );
  }
}

export default compose(
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCartItemsQuery, { name: "getCartItemsQuery" }),
  graphql(getOverlayQuery, { name: "getOverlayQuery" }),
  graphql(getOpenCurrencyQuery, { name: "getOpenCurrencyQuery" }),
  graphql(getArticleCountQuery, { name: "getArticlaCountQuery" })
)(Navigation);

const Navbar = styled.nav`
  width: 1440px;
  height: 80px;
  display: flex;
  flex-direction: row;
  margin: auto;
`;

const Categories = styled.div`
  position: relative;
  height: 56px;
  width: 699.5px;
  left: 0px;
  top: 24px;
  border-radius: 0px;
`;

const CategoriesList = styled.ul`
  width: 679px;
  height: 100%;
  margin-left: 101px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: top;
`;
const CategoriesListItem = styled.li`
  height: 100%;
  font-family:  ${(props) => (props.active ? "Raleway-semibold" : "Raleway")};
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  line-height: 19.2px;
  letter-spacing: 0px;
  text-align: center;
  list-style: none;
  margin-right: 16px;
  margin-left: 16px;
  color: ${(props) => (props.active ? "#5ECE7B" : "#1D1F22")};
  border-bottom: ${(props) => (props.active ? "2px solid #5ECE7B" : "")};
`;
const Alogo = styled.div`
  position: relative;
  height: 41px;
  width: 41px;
  left: 0px;
  top: 24px;
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    text-align: center;
    height: 29.93px;
    width: 31.18px;
    border-radius: 0px;
    margin: auto;
  }
`;

const ActionContainer = styled.div`
  position: relative;
  height: 40px;
  width: 699.5px;
  left: 0px;
  top: 23px;
  border-radius: 0px;
`;

const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 204px;
  height: 29px;
  margin-top: 5.5px;
  margin-left: 394.5px;
  border-radius: 0px;
`;

const CurrencySwitcher = styled.div`
  height: 29px;
  width: 28px;
  margin-left: 134px;
  border-radius: 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;
const Symbol = styled.div`
  width: 22px;
  height: 29px;
  font-family: Raleway;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
  overflow: hidden;
  object-fit: contain;
`;
const CartIcon = styled.div`
  width: 20px;
  height: 20px;
  margin-left: 22px;
  cursor: pointer;
`;
const Counter = styled.div`
  position: relative;
  height: 20px;
  width: 20px;
  left: 590px;
  top: -34px;
  border-radius: 60px;

  color: var(--c-white);
  background-color: black;
  text-align: center;
  /*   visibility: ${(props) => (props.number > 0 ? "visible" : "hidden")}; */
`;
