import React, { Component } from "react";
import styled from "styled-components";

import Layout from "../../components/layout/Layout";

class CheckOut extends Component {
  render() {
    return <Layout>
      <StyledCheckout>
        <h1>THE CHECK OUT PAGE WILL LAND HERE</h1> 
      </StyledCheckout>

      </Layout>;
  }
}

export default CheckOut;

const StyledCheckout = styled.div`
 width:1440px;
 height:450px;
 margin:auto;
 display:flex;
 justify-content:center;
 align-items:center;
 
`