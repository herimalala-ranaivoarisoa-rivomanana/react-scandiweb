import React, {Component} from 'react'
import {BrowserRouter, Routes, Route, Link} from  'react-router-dom'
import ProductPage from './pages/productLandingPage'
class App extends Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProductPage/>} />
          <Route path='/products' element={<ProductPage/>} />
        </Routes>
      </BrowserRouter>

    )
  }
}
export default App;