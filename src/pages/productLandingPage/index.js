import React, { Component } from "react";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  currentCategory,
  getCurrentProductQuery,
  getCartItemsQuery,
  getOverlayQuery,
  currentProduct,
  overlay,
} from "../../graphql/reactivities/state";
import {
  getCategoryQuery,
  getCategoriesQuery,
  getCurrenciesQuery,
} from "../../graphql/queries/queries";

import Layout from "../../components/layout/Layout";
import Product from "../../components/products/Product";

class ProductsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 2,
      currentPage: 1,
    };
  }
  displayCategoryDetails(page = 1) {
    const { category } = this.props.getCategoryQuery;
    const { currentCategory } = this.props.getCurrentCategoryQuery;
    const { currentCurrency } = this.props.getCurrentCurrencyQuery;

    if (category) {
      return (
        <StyledCategory overlay={overlay()}>
          <StyledCategoryName>
            {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
          </StyledCategoryName>
          <StyledProducts>
            {category.products.slice((page - 1) * 6, page * 6).map((item) => {
              return (
                <StyledProductsList
                  key={item.id}
                  onClick={(e) => this.setProduct(item)}
                >
                  <Product product={item} selectedCurrency={currentCurrency} />
                </StyledProductsList>
              );
            })}
          </StyledProducts>
          <StyledProductsPagination>
            {this.state.currentPage > 1 && (
              <li
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  this.setState({ currentPage: this.state.currentPage - 1 });
                }}
              >
                {"<"}
              </li>
            )}
            {Array.from(Array(this.state.pageNumber).keys()).map((page) => {
              return (
                <StyledProductsPages
                  active={this.state.currentPage === page + 1}
                  key={page}
                  onClick={(e) => {
                    this.setState({ currentPage: page + 1 });
                  }}
                >
                  {page + 1}
                </StyledProductsPages>
              );
            })}

            {this.state.currentPage < this.state.pageNumber && (
              <li
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  this.setState({ currentPage: this.state.currentPage + 1 });
                }}
              >
                {">"}
              </li>
            )}
          </StyledProductsPagination>
        </StyledCategory>
      );
    }
  }
  setProduct(obj) {
    if (obj.inStock) {
      currentProduct(obj);
      overlay(false);
      localStorage.setItem("currentProduct", JSON.stringify(obj));
      localStorage.setItem("overlay", overlay());
    }
  }
  render() {
    return (
      <Layout>{this.displayCategoryDetails(this.state.currentPage)}</Layout>
    );
  }
}
export default compose(
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" }),
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCurrentProductQuery, { name: "getCurrentProductQuery" }),
  graphql(getCartItemsQuery, { name: "getCartItemsQuery" }),
  graphql(getOverlayQuery, { name: "getOverlayQuery" }),
  graphql(getCategoryQuery, {
    name: "getCategoryQuery",
    options: (props) => {
      return {
        variables: {
          input: { title: currentCategory() },
        },
      };
    },
  })
)(ProductsPage);

/* Styled components */
const StyledCategory = styled.div`
  display: flex;
  flex-direction: column;
  width: 1440px;
  height: auto;
  margin: auto;
  background-color: ${(props) =>
    props.overlay ? "rgba(57, 55, 72, 0.22)" : "#FFFFFF"};
`;

const StyledCategoryName = styled.div`
  font-family: Raleway;
  padding-left: 106px;
  font-size: 42px;
  font-weight: 400;
  line-height: 67px;
  line-height: 160%;
  letter-spacing: 0px;
  text-align: left;
  color: #1d1f22;
  width: 1440px;
`;

const StyledProducts = styled.ul`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 1440px;
  height: auto;
  margin: auto;
`;
const StyledProductsList = styled.li`
  list-style: none;
  width: 386px;
  padding: 0;
  margin: 20px;
`;

const StyledProductsPagination = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & li {
    list-style: none;
  }
`;
const StyledProductsPages = styled.li`
  margin: 10px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: ${(props) =>
    props.active ? "rgba(57, 55, 72, 0.22)" : ""};
  text-align: center;
  border-radius: 50%;
`;
