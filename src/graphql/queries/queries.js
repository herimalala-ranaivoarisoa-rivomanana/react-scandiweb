import { gql } from "@apollo/client";

const getCategoriesQuery = gql`
  {
    categories {
      name
    }
  }
`;

const getCategoryQuery = gql`
  query ($input: CategoryInput) {
    category(input: $input) {
      name
      products {
        id
        name
        inStock
        gallery
        description
        category
        attributes {
          id
          name
          type
          items {
            id
            value
            displayValue
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
      }
    }
  }
`;

const getProductQuery = gql`
  query ($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          id
          value
          displayValue
        }
      }
      prices {
        currency {
          label
          symbol
        }
        amount
      }
      brand
    }
  }
`;

const getCurrenciesQuery = gql`
  {
    currencies {
      label
      symbol
    }
  }
`;

export {
  getCategoriesQuery,
  getCategoryQuery,
  getProductQuery,
  getCurrenciesQuery,
};
