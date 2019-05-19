//废弃

import React,{Component} from 'react';

class DataContainer extends Component{
  constructor(props){
    super(props);
    this.state ={

    }
  }
  render(){
    const {showTable} = this.props;
    return <div className="data-container">
      {
        showTable ?
        <TableList />:null
      }
    </div>
  }
}