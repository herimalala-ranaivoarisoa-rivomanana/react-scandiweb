import React,{Component} from 'react'
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import { getCurrentCurrencyQuery,currentCurrency } from '../../graphql/reactivities/state';
import {getCurrenciesQuery} from '../../graphql/queries/queries';

class Currency extends Component{
  displayCurrencies(){
    var data = this.props.getCurrenciesQuery;
    if(data.currencies)
      return(
       data.currencies.map(currency=>{
         return(
           <option key={currency.label} value={currency.label} >{currency.symbol}</option>
         )
       })
      )
    }

  render(){
    return(
      <div className="actions">
        <select className="currency" onChange={(e)=>currentCurrency({label:e.target.value})}> 
          {this.displayCurrencies()}
        </select>
      </div>
    )
  }
}
export default compose(
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'})
  
  )(Currency)