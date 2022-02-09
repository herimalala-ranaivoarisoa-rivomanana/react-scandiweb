import React,{Component} from 'react';

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import classes from './productCardElement.module.css';
import { getCurrentCurrencyQuery} from '../../graphql/reactivities/state';
import { 
  /* getProductQuery, */
  getCurrenciesQuery,
  } from '../../graphql/queries/queries';

class Product extends Component {

  displayProduct(){
  const {product} = this.props;
  const {currentCurrency} = this.props.getCurrentCurrencyQuery
  if(product){
    return(
      <div className={classes.ProductCard}>
        <div className={classes.ProductCardContainer}>
          <div className={classes.ProductCardImage}>
              <img  src={product.gallery[0]} alt="Product"/>
          </div> 
          <div className={classes.ProductCardContent}>
            <div  className={classes.ProductCardContentName}>
              {product.name}
            </div>
            <div  className={classes.ProductCardContentPrice}>
              {/* <div className={classes.ProductCardCurrency}>{product.prices[0].currency.symbol}</div> */}
                {/*<div className={classes.ProductCardAmount}>{product.prices[0].amount}</div> */}
              <div className={classes.ProductCardCurrency}>{this.props.selectedCurrency.symbol}</div>
              <div className={classes.ProductCardAmount}>{product.prices.find((price)=>price.currency.label===currentCurrency.label).amount}</div>
            </div>
          </div>
        </div>
        <div className={classes.ProductCardCircleIcon}>
        <img   src="/assets/icons/Basket.svg" alt="Basket icon"/>
        </div>  
        <div className={classes.ProductCardBadge}>
        <img   src="/assets/icons/tick-green.svg" alt="Basket icon"/>
        <p>{product.brand}</p>
        </div> 
        <div  className={classes.ProductCardHeart}>
          <img   src="/assets/icons/heart1.svg" alt="Basket icon"/>
        </div>
        <div className={classes.ProductCardLeaveWhiteBrooch}>
        {product.inStoke?<div className={classes.ProductCardOutOfStock}>
             <p>OUT OF STOCK</p>
           </div>:null}
        </div>
      </div>
    )
  }
  }

  render(){
    return(
      <div>
        {this.displayProduct()}
      </div>
    )
  }
}

/* export default graphql(getProductQuery,{
  options:(props)=>{
    return{
      variables:{
        id:props.id,
      }
    }
  }
})(Product);  */

export default compose(
/*   graphql(getProductQuery,{name:'getProductQuery'},{
    options:(props)=>{
      return{
        variables:{
          id:props.id,
        }
      }
    }
  }), */
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
)(Product)