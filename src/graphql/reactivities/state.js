import { makeVar, gql } from "@apollo/client";

export const currentCurrency = makeVar(
  JSON.parse(localStorage.getItem("currentCurrency")) || {
    label: "USD",
    symbol: "$",
  }
);

export const currentCategory = makeVar(
  JSON.parse(localStorage.getItem("currentCategory")) || "all"
);

export const currentProduct = makeVar(
  JSON.parse(localStorage.getItem("currentProduct")) || {}
);

export const currentProductDetailsImage = makeVar();

export const cartItems = makeVar(
  JSON.parse(localStorage.getItem("cartItems")) || []
);

export const currentAttributes = makeVar(
  JSON.parse(localStorage.getItem("currentAttributes")) || []
);

export const overlay = makeVar(
  JSON.parse(localStorage.getItem("overlay")) || false
);

export const openCurrency = makeVar(
  JSON.parse(localStorage.getItem("openCurrency")) || false
);

export const activateRemoveIcon = makeVar(
  JSON.parse(localStorage.getItem("activateRemoveIcon")) || false
);

export const amount = makeVar(JSON.parse(localStorage.getItem("amount")) || 0);

export const articleCount = makeVar(
  JSON.parse(localStorage.getItem("articleCount")) || 0
);

export const getOpenCurrencyQuery = gql`
  query getOpenCurrency {
    openCurrency @client
  }
`;

export const getFavouritesQuery = gql`
  query getFavourites {
    favourites @client
  }
`;

export const getCartItemsQuery = gql`
  query getCartItems {
    cartItems @client
  }
`;

export const getCurrentAttributesQuery = gql`
  query getCurrentAttributes {
    currentAttributes @client
  }
`;

export const getOverlayQuery = gql`
  query getOverlay {
    overlay @client
  }
`;

export const getCurrentCurrencyQuery = gql`
  query getCurrentCurrency {
    currentCurrency @client
  }
`;
export const getCurrentCategoryQuery = gql`
  query getCurrentCategory {
    currentCategory @client
  }
`;
export const getCurrentProductQuery = gql`
  query getCurrentProduct {
    currentProduct @client
  }
`;
export const getCurrentProductDetailsImageQuery = gql`
  query getCurrentProductDetailsImage {
    currentProductDetailsImage @client
  }
`;

export const getAmountQuery = gql`
  query getAmount {
    amount @client
  }
`;

export const getArticleCountQuery = gql`
  query getArticleCount {
    articleCount @client
  }
`;
