import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,getCartItemsQuery,getOverlayQuery,getAmountQuery, cartItems,overlay,currentCurrency,amount} from '../../graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery,} from '../../graphql/queries/queries';

import CartItem from './CartItem';

class Cart extends Component{
  constructor(props) {
    super(props);
    this.state={
      total:0,
    };
    this.leaveOverlay = this.leaveOverlay.bind(this)
  }
  
  leaveOverlay(){
   overlay(false)
   localStorage.setItem('overlay', JSON.stringify(overlay()));
  }

  render(){
    return(
      <StyledCart overlay={overlay()}>
       {overlay()&&<StyledCartTitle>
          <StyledCartTitlePart1>My Bag </StyledCartTitlePart1>
          <StyledCartTitlePart2>{(cartItems()).length} items </StyledCartTitlePart2>
        </StyledCartTitle>}
        <StyledCartItemsContent  overlay={overlay()}>
          
          {(cartItems()).map((cart,index)=>{
            return(
             <StyledCartItem key={index}> <CartItem cart={cart}/>
             </StyledCartItem>
            )
          })}
        
        </StyledCartItemsContent >
       {overlay()&&<StyledCartAmount>
          <StyledCartAmountLabel>
            Total
          </StyledCartAmountLabel>
          <StyledCartAmountValue>
            {currentCurrency().symbol}{amount().toFixed(2)}    
          </StyledCartAmountValue>

        </StyledCartAmount>}
        {overlay()&&<StyledCartCtaContainer>
          <Link  to="/cart"><StyledCartCtaBag onClick={this.leaveOverlay}>VIEW BAG</StyledCartCtaBag></Link>
          <Link  to="/checkout"><StyledCartCtaCheckout onClick={this.leaveOverlay}>CHECK OUT</StyledCartCtaCheckout></Link>
        </StyledCartCtaContainer>}
      </StyledCart>
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
  graphql(getCartItemsQuery,{name:'getCartItemsQuery'}),
  graphql(getOverlayQuery,{name:'getOverlayQuery'}),
  graphql(getAmountQuery,{name:'getAmountQuery'}),
)(Cart)

const StyledCart = styled.div`
position:${props=>props.overlay? "absolute":""};
z-index:${props=>props.overlay? "100":"0"};
top:${props=>props.overlay? "80px":""};
left:${props=>props.overlay? "1140px":""};
width:${props=>props.overlay?"325px":"1440px"};
display:flex;
flex-direction: column;
background-color: white;
margin: auto;
/* margin-bottom:200px; */
padding-bottom:20px;
`

const StyledCartTitle = styled.div`
display:flex;
flex-direction: row;
height:26px;
margin-bottom:25px;
`

const StyledCartTitlePart1 = styled.div`
font-family: Raleway;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 25.6px;
letter-spacing: 0em;
text-align: right;
margin-right:6px;
padding-left:24px;
`

const StyledCartTitlePart2 = styled.div`
font-family: Raleway;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 25.6px;
letter-spacing: 0em;
text-align: right; 
`

const StyledCartItemsContent = styled.div`
display: flex;
flex-direction: column;
justify-content:left;
align-items: center;
width:${props=>props.overlay?"325px":"1098px"};
margin:auto;
margin-left:${props=>props.overlay?"":"101px"};
margin-right:${props=>props.overlay?"":"101px"};
`

const StyledCartItem = styled.li`
list-style: none;
`

const StyledCartAmount = styled.div`
width:293px;
height:20px;
margin:auto;
display:flex;
flex-direction: row;
justify-content:space-between;
`
const StyledCartAmountLabel = styled.p`
font-family: Roboto;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 18px;
letter-spacing: 0em;
text-align: left;
`

const StyledCartAmountValue = styled.div`
font-family: Raleway;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 26px;
letter-spacing: 0em;
text-align: right;
`

const StyledCartCtaContainer = styled.div`
width:293px;
margin:auto;
display:flex;
flex-direction: row;
justify-content:space-between;
margin-top:35px;
margin-botoom:20px;
`
const StyledCartCtaBag = styled.button`
width:140px;
height:43px;
text-align:center;
font-family: Raleway;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 16.8px;
letter-spacing: 0em;
color:#1D1F22;
cursor: pointer;
`

const StyledCartCtaCheckout = styled.button`
width:140px;
height:43px;
text-align:center;
font-family: Raleway;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 16.8px;
letter-spacing: 0em;
background-color:#5ECE7B;
border:1px solid #5ECE7B;
color:white;
cursor:pointer;
`