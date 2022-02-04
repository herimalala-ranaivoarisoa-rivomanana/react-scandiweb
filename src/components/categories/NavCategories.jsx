import React,{Component} from 'react'
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';

import { getCurrentCategoryQuery,currentCategory } from '../../graphql/reactivities/state';
import {getCategoriesQuery} from '../../graphql/queries/queries';

class NavCategory extends Component{
  displayCategories(){
    var data = this.props.getCategoriesQuery;
    if(data.categories && data.categories.length>0)
      return(
          <div>
            <ul className="categoriesList">
              {
                data.categories.map(category=>{
                return(
                  <li key={category.name} onClick={(e)=>currentCategory(category.name)}>{category.name}</li>
                )
              })
               }
            </ul>
          </div>
      )
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