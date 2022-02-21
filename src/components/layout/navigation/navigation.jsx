import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { graphql } from "@apollo/client/react/hoc";
import compose from "lodash.flowright";

import Currency from "../../currencies/Currency";
import NavCategories from "../../categories/NavCategories";

import {
  getCurrentCurrencyQuery,
  getCurrentCategoryQuery,
  getCartItemsQuery,
  getOverlayQuery,
  getArticleCountQuery,
  overlay,
} from "../../../graphql/reactivities/state";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.viewBag = this.viewCartOverlay.bind(this);
  }

  viewCartOverlay() {
    overlay(true);
    localStorage.setItem("overlay", JSON.stringify(overlay()));
  }

  render() {
    const { articleCount } = this.props.getArticlaCountQuery;
    return (
      <StyledNav>
        <StyledNavCategories>
          <NavCategories />
        </StyledNavCategories>
        <StyledNavLogo>
          <StyledNavLogoImage src='/assets/icons/logo.svg' alt='Basket icon' />
        </StyledNavLogo>
        <StyledNavAction>
          <Currency />
          <StyledNavActionCta>
            <Link to='/'>
              <StyledNavActionImage
                onClick={this.viewCartOverlay}
                src='/assets/icons/cart/emptyCart.svg'
                alt='EmptyCart icon'
              />
            </Link>
            <StyledNavCounter number={articleCount}>
              {articleCount}
            </StyledNavCounter>
          </StyledNavActionCta>
        </StyledNavAction>
      </StyledNav>
    );
  }
}

export default compose(
  graphql(getCurrentCurrencyQuery, { name: "getCurrentCurrencyQuery" }),
  graphql(getCurrentCategoryQuery, { name: "getCurrentCategoryQuery" }),
  graphql(getCartItemsQuery, { name: "getCartItemsQuery" }),
  graphql(getOverlayQuery, { name: "getOverlayQuery" }),
  graphql(getArticleCountQuery, { name: "getArticlaCountQuery" })
)(Navigation);

const StyledNav = styled.nav`
  width: 1440px;
  height: 80px;
  display: flex;
  flex-direction: row;
  margin-bottom: 0px;
  background-color: #ffffff;
`;

const StyledNavCategories = styled.div`
  width: 699.5px;
  height: 80px;
  padding-left: 106px;
`;
const StyledNavLogo = styled.div`
  margin: 0;
  height: 80px;
`;
const StyledNavLogoImage = styled.img`
  width: 41px;
  height: 41px;
  margin: 0;
  margin-top: 30.72px;
`;

const StyledNavAction = styled.div`
  width: 699.5px;
  height: 80px;
  padding-right: 106px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const StyledNavActionImage = styled.img`
  width: 20px;
  height: 20px;
`;

const StyledNavActionCta = styled.div`
  margin: 0;
  margin-left: 22px;
  width: 20px;
  height: 20px;
  align-items: center;
  & img {
    width: 20px;
    heigth: 20px;
  }
`;

const StyledNavCounter = styled.div`
  color: var(--c-white);
  background-color: black;
  text-align: center;
  border-radius: 50%;
  margin-top: -36px;
  margin-left: 10px;
  width: 20px;
  height: 20px;
  visibility: ${(props) => (props.number > 0 ? "visible" : "hidden")};
`;
