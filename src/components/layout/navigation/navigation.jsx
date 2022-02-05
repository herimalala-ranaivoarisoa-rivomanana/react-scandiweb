import React,{Component} from 'react';

import Currency from '../../currencies/Currency'
import NavCategories from '../../categories/NavCategories';

class Navigation extends Component{
  render(){
    return(
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
    )
  }
}

export default Navigation