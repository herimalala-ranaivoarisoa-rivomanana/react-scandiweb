import React, { Component } from 'react'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,getCurrentProductQuery,} from '../../graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery} from '../../graphql/queries/queries';

import Layout from '../../components/layout/Layout'

class ProductDetails extends Component{
  render(){
    return(
    <Layout>
      PRODUCT DETAIL
    </Layout>
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
  graphql(getCurrentProductQuery,{name:'getCurrentProductQuery'}),
)(ProductDetails)