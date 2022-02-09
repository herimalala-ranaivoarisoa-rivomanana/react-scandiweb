import React,{Component} from 'react';
import Header from './header/Header';
import Navigation from './navigation/navigation'

class Layout extends Component{
  render(){
    return(
      <React.Fragment>
        <Header>
          <Navigation/>
        </Header>
        <main>
          {this.props.children}
        </main>
      </React.Fragment>
    )
  }
}

export default Layout;