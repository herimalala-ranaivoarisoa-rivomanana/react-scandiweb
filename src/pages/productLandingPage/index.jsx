import React, { Component } from 'react'
import classes from './productCardElement.module.css'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,currentCategory} from '../../graphql/reactivities/state'
import {getCategoryQuery,getCategoriesQuery,getCurrenciesQuery,} from '../../graphql/queries/queries';

import Layout from '../../components/layout/Layout'
import Product from '../../components/products/Product';

class ProductPage extends Component{
  displayCategoryDetails(){
    const {category} = this.props.getCategoryQuery;
    const {currentCategory} = this.props.getCurrentCategoryQuery
    const {currentCurrency} = this.props.getCurrentCurrencyQuery
    if(category){
      return(
        <div className={classes.category} >
            <div className={classes.categoryName}>
              {currentCategory}
            </div>
            <div>
              <ul className={classes.products}>
              {category.products.map(item=>{
                return (<li key={item.id}>
                         <Product product={item} selectedCurrency={currentCurrency}/>
                      </li>)
              })}
            </ul>
            </div>
        </div>
      )
    } 
}
  render(){
    return(
    <Layout>
      {this.displayCategoryDetails()}
    </Layout>
    )
  }
}
export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
  graphql(getCategoryQuery,{
    name:'getCategoryQuery',
    options:(props)=>{
      return{
        variables:{
          input:{title:currentCategory()},
        }
      }
    }
  }),
)(ProductPage)