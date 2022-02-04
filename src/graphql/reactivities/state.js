import { makeVar, gql } from "@apollo/client";

export const currentCurrency = makeVar({label:"USD"});

export const currentCategory = makeVar("all");

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