import React, { Component } from "react";

import { overlay } from "../../graphql/reactivities/state";

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

export default CartPage;
