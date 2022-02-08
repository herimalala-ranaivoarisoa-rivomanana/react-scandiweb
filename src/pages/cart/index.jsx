import React, { Component } from 'react'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery} from '../../graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery,} from '../../graphql/queries/queries';

import Layout from '../../components/layout/Layout'
import Category from '../../components/categories/Category';

class Cart extends Component{
  render(){
    const {currentCategory} = this.props.getCurrentCategoryQuery
    const {currentCurrency} = this.props.getCurrentCurrencyQuery
    return(
    <Layout>
      CART PAGE
    </Layout>
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
)(Cart)