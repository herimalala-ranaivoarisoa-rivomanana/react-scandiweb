import { makeVar, gql } from "@apollo/client";

export const currentCurrency = makeVar(JSON.parse(localStorage.getItem('currentCurrency'))||{label:"USD",symbol:'$'});

export const currentCategory = makeVar(JSON.parse(localStorage.getItem('currentCategory'))||"all");

export const currentProduct = makeVar(JSON.parse(localStorage.getItem('currentProduct'))||{});

export const currentProductDetailsImage = makeVar();

export const cartItems = makeVar(JSON.parse(localStorage.getItem('cartItems'))||[{}]);

export const overlay = makeVar(JSON.parse(localStorage.getItem('overlay'))||false);

export const getCartItemsQuery = gql`
  query getCartItems{
    CartItems @client
  }
`

export const getOverlayQuery = gql`
  query getOverlay{
    overlay @client
  }
`

export const getCurrentCurrencyQuery = gql`
  query getCurrentCurrency{
    currentCurrency @client
  }
`
export const getCurrentCategoryQuery = gql`
  query getCurrentCategory{
    currentCategory @client
  }
`
export const getCurrentProductQuery = gql`
  query getCurrentProduct{
    currentProduct @client
  }
`
export const getCurrentProductDetailsImageQuery = gql`
  query getCurrentProductDetailsImage{
    currentProductDetailsImage @client
  }`