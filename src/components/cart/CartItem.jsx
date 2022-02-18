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

  render(){
    const product=this.state.product
    return(
      <StyledCartItem overlay={overlay()}> 
        <StyledCartItemDetails overlay={overlay()}>
          <StyledCartItemDetailsBrand>
            {product.brand}
          </StyledCartItemDetailsBrand>
          <StyledCartItemDetailsName>
          {product.name}
          </StyledCartItemDetailsName>
          <StyledCartItemDetailsPrice>
              <StyledCartItemDetailsPriceCurrency >{(currentCurrency()).symbol}</StyledCartItemDetailsPriceCurrency>
              <StyledCartItemDetailsPriceAmount>{product.prices.find((price)=>price.currency.label===currentCurrency().label).amount}</StyledCartItemDetailsPriceAmount>
          </StyledCartItemDetailsPrice>
          <section >
             <StyledCartItemDetailsContentAttributesContainer>
             {
              product.attributes.map((attribute)=>{
                return(
                  <StyledCartItemDetailsContentAttributes key={attribute.id}>
                     <StyledCartItemDetailsContentAttributesName >
                      {attribute.name.toUpperCase()}:
                    </StyledCartItemDetailsContentAttributesName>
                    <StyledCartItemDetailsContentAttributeValueContainer>
                      {
                        attribute.type==="swatch"?
                        
                          <StyledCartItemDetailsContentAttributeValueList>
                          {attribute.items.map((item)=>{
                            return(
                              <StyledCartItemDetailsContentAttributeValue onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} key={item.id} 
                              style={{width:"63px", height:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"60px":"45px",backgroundColor:item.value}}>
                              </StyledCartItemDetailsContentAttributeValue>
                            )
                          })}
                          </StyledCartItemDetailsContentAttributeValueList>
                        :
                         <StyledCartItemDetailsContentAttributeValueList>
                           
                          {attribute.items.map((item)=>{
                            if(item.id!=="Yes"&& item.id!=="No")
                            return(
                              <StyledCartItemDetailsContentAttributeValue onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} 
                                style={{display:"flex",width:"63px",height:"45px",border:" 1px solid #A6A6A6",
                                color:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"var(--c-white)":"#1D1F22",
                                backgroundColor:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"#1D1F22":"var(--c-white)"}} 
                                key={item.id}>
                                <StyledCartItemDetailsContentAttributeValueItem>{item.value}</StyledCartItemDetailsContentAttributeValueItem>
                              </StyledCartItemDetailsContentAttributeValue>
                            )
                            else return(
                              <StyledCartItemDetailsContentAttributeValue 
                               /*  style={{display:"flex",width:"63px",height:"45px",border:" 1px solid #A6A6A6",
                                color:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"var(--c-white)":"#1D1F22",
                                backgroundColor:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"#1D1F22":"var(--c-white)"}}  */
                                key={item.id}>
                              {/*   <StyledCartItemDetailsContentAttributeValueItem>{item.value}</StyledCartItemDetailsContentAttributeValueItem> */}
                               {item.id=="Yes" && 
                               
                               <input onChange={(e)=>this.setAttributes(e,attribute.name,e.target.checked?"Yes":"No",e.target.checked?"Yes":"No")}  type="checkbox" name="attribute.name" value="" checked={this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?true:false}/>
                               
                               }

                              </StyledCartItemDetailsContentAttributeValue>

                            )
                          })}
                          </StyledCartItemDetailsContentAttributeValueList>
                      }
                    </StyledCartItemDetailsContentAttributeValueContainer>
                  </StyledCartItemDetailsContentAttributes>
                )
              })
            }
             </StyledCartItemDetailsContentAttributesContainer>
           </section>
        </StyledCartItemDetails>
        <StyledCartItemRight overlay={overlay()}>
          <StyledCartItemMiddle overlay={overlay()}>
            <StyledCartMiddleOperator >
              <button style={{width:"24px",height:"24px"}} onClick={this.addQuantity}>+</button> 
            </StyledCartMiddleOperator>
            <StyledCartMiddleQty>
              { this.state.qty}
            </StyledCartMiddleQty>
            <StyledCartMiddleOperator>
              <button style={{width:"24px",height:"24px"}} onClick={this.removeQuantity}>-</button> 
            </StyledCartMiddleOperator>
          </StyledCartItemMiddle>
          <StyledCartItemImage>
            <img width={`${overlay()?"105px":"141px"}`} height={`${overlay()?"137px":"185px"}`} srcSet={product.gallery[0]} alt="gallery"/>
          </StyledCartItemImage>

        </StyledCartItemRight>

      </StyledCartItem>
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


const StyledCartItem = styled.div`
display: flex;
flex-direction:row;
justify-content: center;
align-items: center;
width: ${props=>props.overlay?"293px":"1098px"};
margin: auto;
`

const StyledCartItemDetails = styled.div`
display: flex;
flex-direction:column;
width:${props=>props.overlay?"146.5px":"1098px"};
justify-content: flex-start;
`

const StyledCartItemDetailsBrand = styled.div`
font-size: 16px;
font-style: normal;
font-weight: 300;
line-height: 26px;
letter-spacing: 0px;
text-align: left;
`

const StyledCartItemDetailsName = styled.div`
font-size: 16px;
font-style: normal;
font-weight: 300;
line-height: 26px;
letter-spacing: 0px;
text-align: left;
`

const StyledCartItemDetailsPrice= styled.div`
display: flex;
flex-direction: row;
margin-bottom: 27px;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 26px;
letter-spacing: 0em;
text-align: right;
`

const StyledCartItemDetailsPriceCurrency = styled.div`
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 26px;
letter-spacing: 0em;
text-align: right;

`

const StyledCartItemDetailsPriceAmount = styled.div`
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 26px;
letter-spacing: 0em;
text-align: right;
`

const StyledCartItemDetailsContentAttributesContainer = styled.div`
display: flex;
flex-direction: column;
`

const StyledCartItemDetailsContentAttributes = styled.li`
display: flex;
flex-direction: column;
`

const StyledCartItemDetailsContentAttributesName = styled.div`
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: 18px;
letter-spacing: 0em;
margin-bottom:8px;

`


const StyledCartItemDetailsContentAttributeValueContainer = styled.div`

`

const StyledCartItemDetailsContentAttributeValueList = styled.ul`
display: flex;
flex-direction: row;
justify-content:space-between;
align-items: center;
margin-bottom:40px;
`

const StyledCartItemDetailsContentAttributeValue = styled.li`
margin-right:12px;
cursor: pointer;
list-style: none;
`

const StyledCartItemDetailsContentAttributeValueItem = styled.div`

padding:0;
margin:auto;
`
const StyledCartItemRight = styled.div`
display: flex;
flex-direction:row;
justify-content:space-between;
align-items: center;
width: ${props=>props.overlay?"139px":"198px"};
height:${props=>props.overlay?"137px":"185px"};
vertical-align: middle;
`

const StyledCartItemMiddle = styled.div`
width:${props=>props.overlay?"24px":"45px"};
height:${props=>props.overlay?"137px":"185px"};
display:flex;
flex-direction:column;
justify-content:space-between;
align-items:center;
`

const StyledCartMiddleQty = styled.div`
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

const StyledCartItemImage = styled.div`
/* width:${props=>props.overlay?"105px":"141px"};
height:${props=>props.overlay?"137px":"185px"}; */
overflow:hidden;
object-fit: contain;
margin-left:${props=>props.overlay?"10px":"12px"};
`


