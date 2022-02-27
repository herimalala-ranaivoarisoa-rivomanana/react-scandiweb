import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/productListpage/index";
import ProductDetails from "./pages/productDetailsPage";
import CartPage from "./pages/cart";
import CheckOut from "./pages/checkOut";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProductsPage />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/product' element={<ProductDetails />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<CheckOut />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
export default App;
