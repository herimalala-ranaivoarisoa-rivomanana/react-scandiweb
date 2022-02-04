import React,{Component} from 'react';
import classes from './productCardElement.module.css'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery} from '../../graphql/reactivities/state'
import {getCategoryQuery,getCurrenciesQuery} from '../../graphql/queries/queries';
import Product from '../products/Product';


class Category extends Component{
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct:"",
      selectedCurrency:this.props.selectedCurrency,
    }
  }
  displayCategoryDetails(){
      const {category} = this.props.getCategoryQuery;
      const {currentCategory} = this.props.getCurrentCategoryQuery
      const {currentCurrency} = this.props.getCurrentCurrencyQuery
      console.log('currencies',this.props)
      if(category){
        console.log('categorie:',category)
        return(
          <div className={classes.category} >
              <div className={classes.categoryName}>
                {currentCategory}
              </div>
              <div>
                <ul className={classes.products}>
                {category.products.map(item=>{
                  return (<li key={item.id} onClick={(e)=>this.setState({selectedProduct:item.id})}>
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
       <div>
          {this.displayCategoryDetails()}
      </div>
      
    )
  }
}

export default 
compose(
  graphql(getCategoryQuery,{
  name:'getCategoryQuery',
  options:(props)=>{
    return{
      variables:{
        input:{title:props.title},
      }
    }
  }
}),
 graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
 graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
 graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'})
)(Category); 
