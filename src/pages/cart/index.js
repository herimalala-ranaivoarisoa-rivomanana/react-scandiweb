import React, { Component } from "react";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  overlay,
} from "../../graphql/reactivities/state";
import {
  getCategoriesQuery,
  getCurrenciesQuery,
} from "../../graphql/queries/queries";

import Layout from "../../components/layout/Layout";
import Cart from "../../components/cart";

class CartPage extends Component {
  render() {
    return (
      <Layout>
        <Cart overlay={overlay()} />
      </Layout>
    );
  }
}

export default compose(
  graphql(getCurrenciesQuery, { name: "getCurrenciesQuery" }),
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" }),
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" })
)(CartPage);
