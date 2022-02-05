import { InMemoryCache } from '@apollo/client';
import { currentCurrency,currentCategory } from './reactivities/state';

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
      }
    }
  }
})