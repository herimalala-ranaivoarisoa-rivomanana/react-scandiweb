import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import classes from './productDetails.module.css'

import { graphql} from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import {getCurrentCurrencyQuery,getCurrentCategoryQuery,getCurrentProductQuery,
        getCurrentProductDetailsImageQuery,getOverlayQuery, currentCurrency,currentProduct,
        currentProductDetailsImage,overlay, cartItems} from '../../graphql/reactivities/state'
import { getCategoriesQuery,getCurrenciesQuery} from '../../graphql/queries/queries';

import Layout from '../../components/layout/Layout'

class ProductDetails extends Component{
  constructor(props){
    super(props);
    this.state ={
      cartItems:cartItems(),
      attributes:cartItems.attributes?cartItems.attributes:{}
    }
  }
  changeImage(im){
    currentProductDetailsImage(im)
    localStorage.setItem('currentProductDetailsImage', JSON.stringify(currentProductDetailsImage()))
  }

  printDescription(){
    const product = currentProduct()
    return product.description
  }

  setAttributes(e,attribute,id,value){
    e.preventDefault()
    this.setState(prevState => ({
      ...prevState,
      attributes:{...prevState.attributes,[attribute]:{id,value}}
  }));
  }

  addToCart(product,attributes){
   cartItems([...cartItems(),{product,attributes}])
   overlay(true)
   localStorage.setItem('cartItems', JSON.stringify(cartItems()));
   localStorage.setItem('overlay', JSON.stringify(overlay()));
  }

  render(){
    const product = currentProduct()
    const currency = currentCurrency()
    return(
    <Layout>
      <div className={classes.productDetails}>
        <div className={classes.gallery}>
          <ul>
          {
            product.gallery.map((im)=>{
              return(
                <li key={im} onClick={(e)=>{this.changeImage(im)}}>
                 <img  width="79px" height="80px" srcSet={im} alt="gallery"/>
                </li>
             )
            })
          }
          </ul>
        </div>
        <div className={classes.productDetailsContainer}>
          <div className={classes.productDetailsImage}>
             <img width="610px" height="511px" srcSet={currentProductDetailsImage()||product.gallery[0]} alt="gallery"/>
          </div>
          <div className={classes.productDetailsContent}>
            <div className={classes.productDetailsContentName}>
             {product.name}
            </div> 
           <div  className={classes.productDetailsContentAttributes}>
             <ul>
             {
              product.attributes.map((attribute)=>{
                return(
                  <li key={attribute.id}>
                    <div className={classes.productDetailsContentAttributeName}>
                      {attribute.name.toUpperCase()}:
                    </div>
                    <div className={classes.productDetailsContentAttributeValue}>
                      {
                        attribute.type==="swatch"?
                        
                          <ul>
                          {attribute.items.map((item)=>{
                            return(
                              <li onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} key={item.id} style={{width:"63px", height:this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?"60px":"45px",backgroundColor:item.value}}>
                              </li>
                            )
                          })}
                          </ul>
                        :
                        <div>
                         <ul>
                          {attribute.items.map((item)=>{
                            return(
                              <li onClick={(e)=>this.setAttributes(e,attribute.name,item.id,item.value)} className={`${this.state.attributes[attribute.name] && this.state.attributes[attribute.name]["id"]===item.id?classes.productDetailsContentAttributeItemActive:classes.productDetailsContentAttributeItem}`} key={item.id}>
                                <p>{item.value}</p>
                              </li>
                            )
                          })}
                          </ul>
                        </div>
                      }
                    </div>
                  </li>
                )
              })
            }
             </ul>
           </div>
           <div className={classes.productDetailsContentPrice}>
             <p className={classes.productDetailsContentPriceTitle}>PRICE</p>
             <p className={classes.productDetailsContentPriceValue}>{currency.symbol} {product.prices.find((price)=>price.currency.label===currency.label).amount}</p>
           </div>
           <Link to="/products"><button onClick={()=>this.addToCart(product,this.state.attributes)}>ADD TO CART</button></Link>
           <div  className={classes.productDetailsContentDescription} dangerouslySetInnerHTML={{ __html: product.description }} />
          
          </div>
        </div>
        <div className={classes.gallery}>

        </div>
      </div>
    </Layout>
    )
  }
}

export default compose(
  graphql(getCurrenciesQuery,{name:'getCurrenciesQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'}),
  graphql(getCurrentCurrencyQuery,{name:'getCurrentCurrencyQuery'}),
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
  graphql(getCurrentProductQuery,{name:'getCurrentProductQuery'}),
  graphql(getCurrentProductDetailsImageQuery,{name:'getCurrentProductDetailsImageQueryy'}),
  graphql(getOverlayQuery,{name:'getCartItemsQuery'}),
)(ProductDetails)