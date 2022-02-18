import React,{Component} from 'react'
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import { getCurrentCurrencyQuery,currentCurrency,cartItems,amount } from '../../graphql/reactivities/state';
import {getCurrenciesQuery} from '../../graphql/queries/queries';

class Currency extends Component{
  displayCurrencies(){
    var data = this.props.getCurrenciesQuery;
    if(data.currencies)
      return(
       data.currencies.map(currency=>{
         return(
           <option style={{"width":"39px","marginRight":"10px"}} key={currency.label} value={currency.label} >{currency.symbol}</option>
         )
       })
      )
    }
  
  setCurrentCurrency(obj){
    const {currencies} = this.props.getCurrenciesQuery
    var currency = currencies.find(item=>item.label===obj.label)
    currentCurrency(currency)
    localStorage.setItem('currentCurrency', JSON.stringify(currency))
    amount(0)
    cartItems().map(item=>
      amount(amount()+item.qty*item.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount)
     )
    localStorage.setItem('amount', JSON.stringify(amount()));
  }

  render(){
    const {currentCurrency} = this.props.getCurrentCurrencyQuery
    return(
      <select style={{"border":"none","width":"39px","height":"80"}}  onChange={(e)=>this.setCurrentCurrency({label:e.target.value})}> 
      <option value={currentCurrency.label}>{currentCurrency.symbol}</option>
        {this.displayCurrencies()}
      </select>
    )
  }
}
export default compose(
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'})
  
  )(Currency)