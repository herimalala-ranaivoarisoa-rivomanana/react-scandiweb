import React, { Component } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import {
  getCurrentCategoryQuery,
  currentCategory,
} from "../../graphql/reactivities/state";
import { getCategoriesQuery } from "../../graphql/queries/queries";

class NavCategory extends Component {
  displayCategories() {
    var data = this.props.getCategoriesQuery;
    if (data.categories && data.categories.length > 0)
      return (
        <StyledCategoriesList>
          {data.categories.map((category) => {
            const active = currentCategory() === category.name ? true : false;
            return (
              <Link to='/products' key={category.name}>
                <SyledCategoriesListItem
                  active={active}
                  onClick={(e) => this.setCategory(category.name)}
                >
                  {category.name.toUpperCase()}
                </SyledCategoriesListItem>
              </Link>
            );
          })}
        </StyledCategoriesList>
      );
  }
  setCategory(name) {
    currentCategory(name);
    localStorage.setItem("currentCategory", JSON.stringify(name));
  }
  render() {
    return <div>{this.displayCategories()}</div>;
  }
}
export default compose(
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCategoriesQuery, { name: "getCategoriesQuery" })
)(NavCategory);

const StyledCategoriesList = styled.ul`
width:100%;
height:80px;
display:flex;
flex-direction: row;
justify-content:flex-start;
align-items: center;
}
`;
const SyledCategoriesListItem = styled.li`
  font-family: Raleway;
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  line-height: 19px;
  letter-spacing: 0px;
  text-align: center;
  list-style: none;
  margin-right: 32px;
  color: ${(props) => (props.active ? "#5ECE7B" : "#1D1F22")};
  border-bottom: ${(props) => (props.active ? "1px solid #5ECE7B" : "")};
`;
