import React,{Component} from 'react';
import Header from './header/Header';
import Navigation from './navigation/navigation'

class Layout extends Component{
  render(){
    return(
      <body>
        <Header>
          <Navigation/>
        </Header>
        <main>
          {this.props.children}
        </main>
      </body>
    )
  }
}

export default Layout;