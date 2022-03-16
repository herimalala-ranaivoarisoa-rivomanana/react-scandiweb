import React, { Component } from "react";
import styled from "styled-components";
import "./productListPage.css";

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
  articleCount,
  cartItems,
  currentAttributes,
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
      currentPage: 1,
    };
  }
  displayCategoryDetails(page = 1) {
    const { category } = this.props.getCategoryQuery;
    const { currentCategory } = this.props.getCurrentCategoryQuery;
    const { currentCurrency } = this.props.getCurrentCurrencyQuery;
    if (category) {
      return (
        <ProductList overlay={overlay()}>
          <CategoryName>
            {currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}
          </CategoryName>
          <ProductsListContainer>
            {category.products
              .slice((page - 1) * 6, page * 6)
              .map((item, index) => {
                return (
                  <div
                    onClick={(e) => this.setProduct(item)}
                    className={`item${index + 1}`}
                    key={item.id}
                  >
                    {" "}
                    <Product
                      product={item}
                      selectedCurrency={currentCurrency}
                    />
                  </div>
                );
              })}
          </ProductsListContainer>
          <Pagination>
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
            {Array.from(
              Array(Math.ceil(category.products.length / 6)).keys()
            ).map((page) => {
              if (Math.ceil(category.products.length / 6) > 1)
                return (
                  <Pages
                    active={this.state.currentPage === page + 1}
                    key={page}
                    onClick={(e) => {
                      this.setState({ currentPage: page + 1 });
                    }}
                  >
                    {page + 1}
                  </Pages>
                );
            })}

            {this.state.currentPage <
              Math.ceil(category.products.length / 6) && (
              <li
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  this.setState({ currentPage: this.state.currentPage + 1 });
                }}
              >
                {">"}
              </li>
            )}
          </Pagination>
        </ProductList>
      );
    }
  }
  setProduct(obj) {
    
      currentProduct(obj);
      overlay(false);
      localStorage.setItem("currentProduct", JSON.stringify(obj));
      localStorage.setItem("overlay", overlay());
    
  }
  render() {
    articleCount(0);
    cartItems().map((item) => articleCount(articleCount() + item.qty));
    localStorage.setItem("articleCount", JSON.stringify(articleCount()));
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
const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  width: 1440px;
  margin: auto;
  height: 1513px;
  padding-top: 80px;
  background-color: ${(props) => (props.overlay ? "" : "#FFFFFF")};
`;

const CategoryName = styled.div`
  font-family: Raleway;
  font-size: 42px;
  font-weight: 400;
  line-height: 67.2px;
  line-height: 160%;
  letter-spacing: 0px;
  text-align: left;
  color: #1d1f22;
  width: 1339px;
  margin-left: 101px;
`;

const ProductsListContainer = styled.ul`
  /*   display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 1440px; */
  width: 1240px;
  margin: auto;
  margin-top:102px;
  margin-bottom: 83px;
  display: grid;
  grid-template-columns: [col0] 386px [col1] 386px [col2] 386px[col3];
  grid-template-rows: [row0]444px [row1] 444px [row2];
  column-gap: 40px;
  row-gap: 75px;
`;
const Pagination = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  & li {
    list-style: none;
  }
`;
const Pages = styled.li`
  margin: 10px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-color: ${(props) =>
    props.active ? "rgba(57, 55, 72, 0.22)" : ""};
  text-align: center;
  vertical-align: middle;
  border-radius: 50%;
`;
