import { InMemoryCache } from '@apollo/client';
import { currentCurrency,currentCategory,currentProduct,currentProductDetailsImage,overlay,cartItems,favourites,amount,articleCount } from './reactivities/state';

// Here ,let's define our type and field poliies for our reactive variable.

export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentCategory: {
          read() {
            return currentCategory();
          }
        },
        currentCurrency: {
          read() {
            return currentCurrency();
          }
        },
        currentProduct: {
          read() {
            return currentProduct();
          }
        },
        currentProductDetailsImage: {
          read() {
            return currentProductDetailsImage();
          }
        },
        overlay: {
          read() {
            return overlay();
          }
        },
        cartItems: {
          read() {
            return cartItems();
          }
        },
        favourites: {
          read() {
            return favourites();
          }
        },
        amount: {
          read() {
            return amount();
          }
        },  
        articleCount: {
          read() {
            return articleCount();
          }
        },  
      }
    }
  }
})