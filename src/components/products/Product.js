import React,{Component} from 'react';
import styled from 'styled-components'

import {Link} from 'react-router-dom';

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import { getCurrentCurrencyQuery,getCartItemsQuery,getOverlayQuery,getFavouritesQuery,cartItems,overlay,favourites,articleCount} from '../../graphql/reactivities/state';
import { getCurrenciesQuery} from '../../graphql/queries/queries';

import '../../index.css'


class Product extends Component {
  constructor(props) {
    super(props)
    this.state={
      hover:false
    }
  }

  displayProduct(){
  const {product} = this.props;
  const {currentCurrency} = this.props.getCurrentCurrencyQuery
  
  if(product){
    const inCart=(cartItems()).find( (carte) => carte.product.id===product.id)
    const inFavourite=(favourites()).find( (fav) => fav.id===product.id)
    return(
      <StyledProductCardContainer onMouseOver={()=>this.setState({hover:true})} onMouseLeave={()=>this.setState({hover:false})}>
        <StyledProductCard overlay={overlay()}>
            <StyledProductCardImageContainer>
                <StyledProductCardImage  src={product.gallery[0]} alt="Product"/>
            </StyledProductCardImageContainer> 
            <StyledProductCardDetails>
              <StyledProductCardName >
                {product.name}
              </StyledProductCardName>
              <StyledCardPrice>
                <StyledCardPriceCurrency>{this.props.selectedCurrency.symbol}</StyledCardPriceCurrency>
                <StyledCardPriceAmount>{product.prices.find((price)=>price.currency.label===currentCurrency.label).amount}</StyledCardPriceAmount>
              </StyledCardPrice>
            </StyledProductCardDetails>
          </StyledProductCard>
          <Link style={{"texDecoration":"none","cursor":"default"}} to={`${product.inStock&!inCart?'../product':'/'}`}>
              <StyledCartIcon inCart={inCart} inStock={product.inStock} hover={this.state.hover} onClick={(e)=>{if(inCart) this.removeFromCart(product)}}> 
                <StyledCartIconImage 
                  src={`${product.inStock?!inCart?this.state.hover?"/assets/icons/cart/add-to-cart.svg":'':this.state.hover?"/assets/icons/cart/remove-from-cart.svg":"/assets/icons/cart/inCart.svg":""}`}  
                  alt="" />
              </StyledCartIcon>
          </Link>
          <StyledCardBadge inStock={product.inStock} inCart={inCart}>
            <StyledCardBadgeIcon   src="/assets/icons/tick-green.svg" alt="Basket icon"/>
            <StyledCardBadgeBrand>{product.brand}</StyledCardBadgeBrand>
          </StyledCardBadge > 
          <StyledFavourite inCart={inCart}  onClick={(e)=>{!inFavourite?this.addToFavourite(product):this.removeFromFavorite(product)}}>
            <StyledFavouriteIcon
               src={`${inCart?!inFavourite?this.state.hover?"/assets/icons/wishlist/add-to-wishlist.svg":'':this.state.hover?"/assets/icons/wishlist/remove-from-wishlist.svg":"/assets/icons/wishlist/in-wishlist.svg":""}`}  
               inCart={inCart} inFavourite={inFavourite} hover={this.state.hover}/>
          </StyledFavourite>
          <StyledCardLeaveWhiteBrooch inStock={product.inStock}>
          <StyledCardOutOfStock inStock={product.inStock}>
              <StyledCardOutOfStockText inStock={product.inStock}>OUT OF STOCK</StyledCardOutOfStockText>
            </StyledCardOutOfStock>
        </StyledCardLeaveWhiteBrooch>
      </StyledProductCardContainer>
    )
  }
  }

  removeFromCart(product){
    this.removeFromFavorite(product)
    const cartItemsTemp = cartItems().filter(cart=>cart.product.id!==product.id)
    articleCount(articleCount()-1)
          localStorage.setItem('articleCount', JSON.stringify(articleCount()));
    cartItems(cartItemsTemp)
    localStorage.setItem('cartItems', JSON.stringify(cartItems()));
   }

  addToFavourite(product){
    favourites([...favourites(),product])
    localStorage.setItem('favourites', JSON.stringify(favourites()));
   }

  removeFromFavorite(product){
    const favouritesTemp = favourites().filter(favourite=>favourite.id!==product.id)
    favourites(favouritesTemp)
    localStorage.setItem('favourites', JSON.stringify(favourites()));
  }

  render(){
    return(
      <div>
        {this.displayProduct()}
      </div>
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getOverlayQuery,{name:'getOverlayQuery'}),
  graphql(getCartItemsQuery,{name:'getCartItemsQuery'}),
  graphql(getFavouritesQuery,{name:'getFavouritesQuery'}),
)(Product)



const StyledProductCardContainer = styled.div`
width:386px;
height:444px;
&:hover{
  filter:	drop-shadow(0px	4px	35px rgba(168, 172, 176, 0.19)); 
}
`

const StyledProductCard = styled.div`
position: relative;
padding:16px;
top:16px;
margin:auto;
width:386px;
height:412px;
background-color:${props =>props.overlay?"rgba(57, 55, 72,0)": "#FFFFFF"}; 
`
const StyledProductCardImageContainer = styled.div`
overflow:hidden;
object-fit: contain;
width:354px;
height:330px;
margin-bottom:8px;
background-color:#C4C4C4;
`

const StyledProductCardImage = styled.img`
opacity:95%;
width:354px;
height:330px;
`
const StyledProductCardDetails = styled.div`
color:#8D8F9A;
font-family: Raleway;
font-style: normal;
`

const StyledProductCardName = styled.p`
font-family: Raleway;
font-size: 18px;
font-style: Light;
font-weight: 300;
line-height: 160%;
letter-spacing: 0px;
text-align: left;
vertical-align:top;
`
const StyledCardPrice = styled.div`
display:flex;
flex-direction:row;
justify-content:flex.start;
`
const StyledCardPriceCurrency = styled.div`
font-family: Raleway;
font-style: Medium;
font-size: 18px;
/* line-height: 29px */
line-height: 160%;
align:right;
vertical-align:top;
margin-right:4px;
color:#1D1F22;
`

const StyledCardPriceAmount = styled.div`
font-family: Raleway;
font-style: Medium;
font-size: 18px;
/* line-height: 29px */
line-height: 160%;
align:right;
vertical-align:top;
color:#1D1F22;
`

const StyledCartIcon = styled.div`
/* display:${props=>props.inCart?"block":"none"}; */
position: relative;
border-radius:50%;
top: -76px;
left:303px;
width:52px;
height:52px;
z-index:11;
background-color:${props=>props.inStock?!props.inCart?props.hover?"#5ECE7B":'none':props.hover?"red":"#5ECE7B":"none"};
visibility:${props=>props.inStock?!props.inCart?props.hover?"visible":'hidden':props.hover?"visible":"visible":"hidden"};
filter:	drop-shadow(0px	4px	11px rgba(29, 31, 34, 0.1));
cursor:pointer; 
}
`

const StyledCartIconImage = styled.img`
width: 24px;
height: 21px;
margin-left:14px;
margin-right:14px;
margin-top:15.5px;
margin-bottom:15.5px;
`

const StyledCardBadge = styled.div`
position: relative;
top:-424px;
left:16px;
/* width:61px; */
width:122px;
height:35px;
display: flex;
flex-direction: row;
justify-content:center;
align-items:center;
color:var(--c-primary);
`

const StyledCardBadgeIcon = styled.img`
overflow:hidden;
width: 12px;
height: 12px;
margin-right: 5px;
`
const StyledCardBadgeBrand = styled.p`
font-family: Raleway;
font-size: 12px;
font-style: normal;
font-weight: 600;
line-height: 19.2px;
letter-spacing: 0px;
text-align: center;
`
const StyledFavourite = styled.div`
visibility:${props=>props.inCart?"visible":"hidden"};
position: relative;
top:-452px;
left:318px;
width:20px;
height:20px;
cursor:pointer; 
`
const StyledFavouriteIcon = styled.img`
display:${props=>props.inCart&&!props.favourite?"block":"none"};
width: 20px;
height: 17px;
visibility:${props=>props.inFavourite?"visible":"hidden"};/* 
background-color:${props=>props.inStock?!props.inCart?props.hover?"#5ECE7B":'none':props.hover?"red":"#5ECE7B":"none"}; */
visibility:${props=>props.inCart?!props.inFavourite?props.hover?"visible":'hidden':props.hover?"visible":"visible":"hidden"};
`

const StyledCardLeaveWhiteBrooch = styled.div`
position: relative;
display:${props=>props.inStock?"none":"flex"};
justify-content: center;
align-items: center;
top:-491.5px;
left:15px;
width:356px;
height:338px;
background-color:var(--c-white);
opacity:50%;
z-index: 10;
`

const StyledCardOutOfStock = styled.div`
width:173px;
height:39px;
`
const StyledCardOutOfStockText = styled.p`
font-family: Raleway;
font-size: 24px;
font-style: normal;
font-weight: 400;
line-height: 38px;
letter-spacing: 0px;
text-align: left;
`
