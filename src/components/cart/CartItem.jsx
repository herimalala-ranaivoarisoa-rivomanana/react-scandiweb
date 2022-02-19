import React, { Component } from 'react'
import styled from 'styled-components'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,currentCurrency,getCartItemsQuery,cartItems,amount,articleCount,overlay} from '../../graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery,} from '../../graphql/queries/queries';

class CartItem extends Component{
  constructor(props){
    super(props)
    this.state={
      product:this.props.cart.product,
      attributes:(cartItems().find((item)=>item.product.id===props.cart.product.id)).attributes,
      qty:(cartItems().find((item)=>item.product.id===props.cart.product.id)).qty||1,
      galleryIndex:0,
    }
    amount(0)
    cartItems().map(item=>
      amount(amount()+item.qty*item.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount)
     )
    localStorage.setItem('amount', JSON.stringify(amount()));
    articleCount(0)
    cartItems().map(item=>
      articleCount(articleCount()+item.qty)
     )
     localStorage.setItem('articleCount', JSON.stringify(articleCount()));
   /*  amount(amount()+item.qty*item.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount) */
    this.addQuantity = this.addQuantity.bind(this)
    this.removeQuantity = this.removeQuantity.bind(this)
  }

  
  setAttributes(e,attribute,id,value){
    e.preventDefault()
    const cartItemsTemp = cartItems().filter(cart=>cart.product.id!==this.state.product.id)
    cartItems([...cartItemsTemp,{product:this.state.product,attributes:{...this.state.attributes,[attribute]:{id,value}},qty:this.state.qty}])
    localStorage.setItem('cartItems', JSON.stringify(cartItems()));
    this.setState(prevState => ({
      ...prevState,
      attributes:{...prevState.attributes,[attribute]:{id,value}},
  }));
  }

  addQuantity(e){
    e.preventDefault()
    amount(0);
    const cartItemsTemp = cartItems().filter(cart=>cart.product.id!==this.state.product.id)
    cartItems([...cartItemsTemp,{product:this.state.product,attributes:this.state.attributes,qty:this.state.qty+1,amount:this.state.qty*this.state.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount}])
    localStorage.setItem('cartItems', JSON.stringify(cartItems()));
    cartItems().map(item=>
      amount(amount()+item.qty*item.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount)
     )
    localStorage.setItem('amount', JSON.stringify(amount()));
    articleCount(articleCount()+1)
    localStorage.setItem('articleCount', JSON.stringify(articleCount()));
    this.setState(prevState => ({
      ...prevState,
      qty:prevState.qty+1
   }))
  }

  removeQuantity(e){
    e.preventDefault()
    if(this.state.qty-1>0)  {    const cartItemsTemp = cartItems().filter(cart=>cart.product.id!==this.state.product.id)
          cartItems([...cartItemsTemp,{product:this.state.product,attributes:this.state.attributes,qty:this.state.qty-1>0?this.state.qty-1:1}])
          localStorage.setItem('cartItems', JSON.stringify(cartItems()));
          cartItems().map(item=>
          { amount(amount()-item.product.prices.find((price)=>price.currency.label===currentCurrency().label).amount)
          }
          )
          localStorage.setItem('amount', JSON.stringify(amount()));
          articleCount(articleCount()-1)
          localStorage.setItem('articleCount', JSON.stringify(articleCount()));
          this.setState(prevState => ({
            ...prevState,
            qty:prevState.qty-1>0?prevState.qty-1:1
          }))}
    
   }

   galleryIndexUp(e){
    this.setState(prevState => ({
      ...prevState,
      galleryIndex:prevState.galleryIndex+1<this.state.product.gallery.length?prevState.galleryIndex+1:this.state.product.gallery.length-1
    }))
   }

   galleryIndexDown(e){
    this.setState(prevState => ({
      ...prevState,
      galleryIndex:prevState.galleryIndex-1>0?prevState.galleryIndex-1:0
    }))
   }

  render(){
    const product=this.state.product
    return(
      <StyledCart overlay={overlay()}> 
        <StyledCartDetails overlay={overlay()}>
          <StyledCartBrand overlay={overlay()}>
            {product.brand}
          </StyledCartBrand>
          <StyledCartName overlay={overlay()}>
          {product.name}
          </StyledCartName>
          <StyledCartPrice overlay={overlay()}>
              <StyledCartPriceCurrency >{(currentCurrency()).symbol}</StyledCartPriceCurrency>
              <StyledCartPriceAmount>{product.prices.find((price)=>price.currency.label===currentCurrency().label).amount}</StyledCartPriceAmount>
          </StyledCartPrice>
          <section >
             <StyledCartAttributesContainer overlay={overlay()}>
             {
              product.attributes.map((attribute)=>{
                return(
                  <StyledCartAttributes key={attribute.id} overlay={overlay()}>
                    <StyledCartAttributesContents overlay={overlay()}>
                      {
                        attribute.type==="swatch"?
                        
                          <StyledCartAttributesContentList overlay={overlay()} swatch={true}>
                          {attribute.items.map((item)=>{
                            return(
                              <StyledCartAttributeValue swatch={true} overlay={overlay()} onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} key={item.id} 
                              style={{border:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"2px solid orange":"1px solid #A6A6A6",backgroundColor:item.value}}
                              /* style={{border:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"4px solid #5ECE7B":"1px solid #A6A6A6",backgroundColor:item.value}} */>
                              </StyledCartAttributeValue>
                            )
                          })}
                          </StyledCartAttributesContentList>
                        :
                         <StyledCartAttributesContentList overlay={overlay()}>
                           
                          {attribute.items.map((item)=>{
                            if(item.id!=="Yes"&& item.id!=="No")
                            return(
                              <StyledCartAttributeValue overlay={overlay()} onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} 
                                style={{border:" 1px solid #A6A6A6",
                                color:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"var(--c-white)":"#1D1F22",
                                backgroundColor:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"#1D1F22":"var(--c-white)"}} 
                                key={item.id}>
                                <StyledCartAttributeValueItem overlay={overlay()}>{item.value}</StyledCartAttributeValueItem>
                              </StyledCartAttributeValue>
                            )
                            else return(
                              <StyledCartAttributeCheck overlay={overlay()} key={item.id}>
                               {item.id=="Yes" && 
                               
                               <input onChange={(e)=>this.setAttributes(e,attribute.name,e.target.checked?"Yes":"No",e.target.checked?"Yes":"No")}  type="checkbox" name="attribute.name" value="" checked={this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?true:false}/>
                               
                               }

                               {item.id=="Yes" &&<StyledCartAttributeCheckName overlay={overlay()}> 
                                 {attribute.name}
                               </StyledCartAttributeCheckName>}

                              </StyledCartAttributeCheck>

                            )
                          })}
                          </StyledCartAttributesContentList>
                      }
                    </StyledCartAttributesContents>
                  </StyledCartAttributes>
                )
              })
            }
             </StyledCartAttributesContainer>
           </section>
        </StyledCartDetails>
        <StyledCartRight>
          <StyledCartMiddle overlay={overlay()}>
            <StyledCartMiddleOperator overlay={overlay()} >
              <StyledCartButton overlay={overlay()} onClick={this.addQuantity}>+</StyledCartButton> 
            </StyledCartMiddleOperator>
            <StyledCartMiddleQty overlay={overlay()}>
              { this.state.qty}
            </StyledCartMiddleQty>
            <StyledCartMiddleOperator overlay={overlay()}>
              <StyledCartButton overlay={overlay()} onClick={this.removeQuantity}>-</StyledCartButton> 
            </StyledCartMiddleOperator>
          </StyledCartMiddle>
          <StyledCartImageContainer overlay={overlay()}>
            <StyledCartImage width={`${overlay()?"105px":"141px"}`} height={`${overlay()?"137px":"185px"}`}  
             overlay={overlay()} srcSet={product.gallery[this.state.galleryIndex]}  alt="gallery"/>
             <StyledImageNav overlay={overlay()}>
              <StyledCartImage width="8px" height="14px"  
              srcSet="assets/icons/leftArrow.svg" 
              onClick={(e)=>this.galleryIndexDown(e)} alt="gallery"/>
              <StyledCartImage width="8px" height="14px"  
              srcSet="assets/icons/rightArrow.svg" 
              onClick={(e)=>this.galleryIndexUp(e)} alt="gallery"/>
             </StyledImageNav>
          </StyledCartImageContainer>
        </StyledCartRight>
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
)(CartItem)


const StyledCart = styled.div`
display: flex;
flex-direction:row;
justify-content: center;
align-items: center;
width: ${props=>props.overlay?"293px":"1098px"};
/* height:${props=>props.overlay?"137px":"225px"}; */
margin: auto;
margin-bottom:${props=>props.overlay?"41px":"0"};
padding-top:${props=>props.overlay?"0":"20px"};
padding-bottom:${props=>props.overlay?"0":"20px"};
border-bottom:${props=>props.overlay?"none":"2px solid #E5E5E5"};
`

const StyledCartDetails = styled.div`
display: flex;
flex-direction:column;
width:${props=>props.overlay?"146.5px":"900px"};
justify-content: flex-start;
`

const StyledCartBrand = styled.div`
font-size: ${props=>props.overlay?"16px":"30px"};
font-style: normal;
/* font-weight:${props=>props.overlay?"300":"600"}; */
font-weight:${props=>props.overlay?"600":"600"};
line-height:${props=>props.overlay?"25.6px":"27px"};
letter-spacing: 0px;
text-align: left;
margin-bottom:${props=>props.overlay?"5px":"16px"};
`

const StyledCartName = styled.div`
font-size: ${props=>props.overlay?"16px":"30px"};
font-style: normal;
font-weight:${props=>props.overlay?"300":"400"};
line-height:${props=>props.overlay?"25.6px":"27px"};
letter-spacing: 0px;
text-align: left;
margin-bottom:${props=>props.overlay?"5px":"16px"};
`

const StyledCartPrice= styled.div`
display: flex;
flex-direction: row;
margin-bottom:${props=>props.overlay?"27px":"12px"};
`

const StyledCartPriceCurrency = styled.div`
font-size:${props=>props.overlay?"16px":"24px"}
font-style: normal;
font-weight:${props=>props.overlay?"500":"700"};
line-height:${props=>props.overlay?"25.6px":"18px"};
letter-spacing: 0em;
text-align: right;

`

const StyledCartPriceAmount = styled.div`
font-size:${props=>props.overlay?"16px":"24px"}
font-style: normal;
font-weight:${props=>props.overlay?"500":"700"};
line-height:${props=>props.overlay?"25.6px":"18px"};
letter-spacing: 0em;
text-align: right;
`

const StyledCartAttributesContainer = styled.div`
${props=>props.overlay?"146.5px":"900px"};
display: flex;
flex-direction: column;
`

const StyledCartAttributes = styled.li`
width:${props=>props.overlay?"146.5px":"900px"};
display: flex;
flex-direction: column;
`

const StyledCartAttributesContents = styled.div`
width:${props=>props.overlay?"146.5px":"900px"};

`
const StyledCartAttributesContentList = styled.ul`
width:${props=>props.overlay?"146.5px":"900px"};
display: flex;
flex-direction: row;
justify-content:flex-start;
align-items: center;
margin-bottom:12px;
`

const StyledCartAttributeValue = styled.li`
min-width:${props=>props.overlay?props.swatch?"12px":"24px":"63px"};
height:${props=>props.overlay?"24px":"45px"};
display: flex;
margin-right:12px;
cursor: pointer;
list-style: none;
align-items: center;
`

const StyledCartAttributeValueItem = styled.div`
font-family: Source Sans Pro;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 22px;
letter-spacing: 0em;
margin:auto;

`
const StyledCartAttributeCheck = styled.div`
display:flex;
flex-direction: row;
align-items: center;
& input{
  margin-right:4px;
}
`
const StyledCartAttributeCheckName = styled.div`
font-family: Source Sans Pro;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 22px;
letter-spacing: 0em;
text-align: center;
margin:0;
padding:0;
`

const StyledCartRight = styled.div`
display: flex;
flex-direction:row;
justify-content:space-between;
align-items: center;
width: ${props=>props.overlay?"139px":"198px"};
/* height:${props=>props.overlay?"137px":"185px"}; */
height:100%;
vertical-align: middle;
`

const StyledCartMiddle = styled.div`
width:${props=>props.overlay?"24px":"45px"};
height:100%;
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:center;
`

const StyledCartMiddleQty = styled.div`
margin-top: ${props=>props.overlay?"34px":"36px"};
margin-bottom: ${props=>props.overlay?"34px":"36px"};
`

const StyledCartMiddleOperator = styled.div`
font-family: Raleway;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 26px;
letter-spacing: 0em;
text-align: center;
cursor:pointer;
`

const StyledCartImageContainer = styled.div`
width:${props=>props.overlay?"105px":"141px"};
height:${props=>props.overlay?"137px":"185px"};
overflow:hidden;
object-fit: contain;
margin-left:${props=>props.overlay?"10px":"12px"};
`

const StyledCartImage = styled.img`

`
const StyledImageNav = styled.div`
position:relative;
top:${props=>props.overlay?"-80px":"-102px"};
left:0;
width:${props=>props.overlay?"105px":"141px"};
height:${props=>props.overlay?"14px":"24px"};
background:none;
display:flex;
flex-direction:row;
justify-content:space-between;
& img{
  margin-left:12px;
  margin-right:12px;
  cursor: pointer;
}
`


const StyledCartButton = styled.button`

width:${props=>props.overlay?"24px":"45px"};
height:${props=>props.overlay?"24px":"45px"};

`



