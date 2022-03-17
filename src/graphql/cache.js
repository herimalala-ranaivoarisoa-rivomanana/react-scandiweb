import { InMemoryCache } from "@apollo/client";
import {
  currentCurrency,
  currentCategory,
  currentProduct,
  currentProductDetailsImage,
  overlay,
  cartItems,
  amount,
  articleCount,
  currentAttributes,
  isActiveAttributes,
  openCurrency,
  activeIcon
} from "./reactivities/state";

// Here ,let's define our type and field poliies for our reactive variable.

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentCategory: {
          read() {
            return currentCategory();
          },
        },
        currentCurrency: {
          read() {
            return currentCurrency();
          },
        },
        openCurrency: {
          read() {
            return openCurrency();
          },
        },
        currentProduct: {
          read() {
            return currentProduct();
          },
        },
        currentAttributes: {
          read() {
            return currentAttributes();
          },
        },
        isActiveAttributes: {
          read() {
            return isActiveAttributes();
          },
        },
        currentProductDetailsImage: {
          read() {
            return currentProductDetailsImage();
          },
        },
        overlay: {
          read() {
            return overlay();
          },
        },
        cartItems: {
          read() {
            return cartItems();
          },
        },
        activeIcon: {
          read() {
            return activeIcon();
          },
        },
        amount: {
          read() {
            return amount();
          },
        },
        articleCount: {
          read() {
            return articleCount();
          },
        },
      },
    },
  },
});
