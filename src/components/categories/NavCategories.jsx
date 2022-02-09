import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import { getCurrentCategoryQuery,currentCategory,currentProductDetailsImage } from '../../graphql/reactivities/state';
import {getCategoriesQuery} from '../../graphql/queries/queries';

class NavCategory extends Component{
  displayCategories(){
    var data = this.props.getCategoriesQuery;
    if(data.categories && data.categories.length>0)
      return(
        <ul className="categoriesList">
          {
            data.categories.map(category=>{
            return(
              <Link to="/products" key={category.name}>
                <li className={`${currentCategory()===category.name?'active':''}`}  onClick={(e)=>this.setCategory(category.name)}>
                {category.name.toUpperCase()}
              </li>
              </Link> 
            )
          })
            }
        </ul>
      )
    }
    setCategory(name){
      currentCategory(name)
      localStorage.setItem('currentCategory', JSON.stringify(name))
      currentProductDetailsImage("")
      localStorage.setItem('currentProductDetailsImage', JSON.stringify(currentProductDetailsImage()))
    }
  render(){
    return(
      <div>
     { this.displayCategories()}
      </div>
    )
  }
}
export default compose(
  graphql(getCurrentCategoryQuery,{name:'getCurrentCategoryQuery'}),
  graphql(getCategoriesQuery,{name:'getCategoriesQuery'})
  )(NavCategory)