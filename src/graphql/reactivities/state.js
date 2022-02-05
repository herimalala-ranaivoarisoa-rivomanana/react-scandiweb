import { makeVar, gql } from "@apollo/client";

export const currentCurrency = makeVar(JSON.parse(localStorage.getItem('currentCurrency'))||{label:"USD",symbol:'$'});

export const currentCategory = makeVar(JSON.parse(localStorage.getItem('currentCategory'))||"all");

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