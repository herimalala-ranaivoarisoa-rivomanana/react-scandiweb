import React, {Component} from 'react'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery} from './graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery,} from './graphql/queries/queries';

import Currency from './components/currencies/Currency'
import NavCategories from './components/categories/NavCategories';

import Category from './components/categories/Category';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory:"tech",
      selectedCurrency:{label:"USD",symbol:'$'}
    }
  }
  render(){
    const {currentCategory} = this.props.getCurrentCategoryQuery
    const {currentCurrency} = this.props.getCurrentCurrencyQuery
    return(
      <div>
        <header>
          <nav>
            <NavCategories/>
            <div className="logo">
              <img   src="/assets/icons/logo.svg" alt="Basket icon"/>
            </div>
            <div className="actionsContainer">
            <Currency/>
               <div className="cart-cta">
                 <img   src="/assets/icons/basketempty.svg" alt="Basket icon"/>
               </div>
            </div>
          </nav>
        </header>
          <Category title={currentCategory} selectedCurrency={currentCurrency}/>
      </div>
     
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
)(App)