import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import classes from './productLandingPage.module.css'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,currentCategory,getCurrentProductQuery,currentProduct} from '../../graphql/reactivities/state'
import {getCategoryQuery,getCategoriesQuery,getCurrenciesQuery,} from '../../graphql/queries/queries';

import Layout from '../../components/layout/Layout'
import Product from '../../components/products/Product';

class ProductsPage extends Component{
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
              return (
               <Link to='../product'>
                <li key={item.id} onClick={(e)=>this.setProduct(item)}>
                  <Product product={item} selectedCurrency={currentCurrency}/>
                </li>
               </Link> 
              )
            })}
          </ul>
          </div>
        </div>
      )
    } 
}
setProduct(obj){
  currentProduct(obj)
  localStorage.setItem('currentProduct', JSON.stringify(obj))
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
  graphql(getCurrentProductQuery,{name:'getCurrentProductQuery'}),
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
)(ProductsPage)