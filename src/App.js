import React, {Component} from 'react'
import {BrowserRouter, Routes, Route} from  'react-router-dom'
import ProductsPage from './pages/productLandingPage'
import ProductDetails from './pages/productDetailsPage'
class App extends Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProductsPage/>} />
          <Route path='/products' element={<ProductsPage/>} />
          <Route path='/product' element={<ProductDetails/>} />
        </Routes>
      </BrowserRouter>

    )
  }
}
export default App;