import  React,{Component } from 'react'
import { Select, Icon, Input, Button, message } from 'antd'
import './index.less'
import PropTypes from "prop-types";

export default class extends Component{
  static contextTypes = {
    location: PropTypes.object,
    router: PropTypes.object.isRequired
  };

  jump = (url,state) => {
    this.context.router.history.push({pathname:url,state})
  }

  render(){
    return (
      <div className="lee-main">
        <div className="shade"></div>
        <div className="label">
          <div className="shade-label shade-top"></div>
          <div className="shade-label shade-title">BIG DATA WEB</div>
          <div className="shade-label shade-mid">Agricultural Monitor</div>
          <div className="shade-label shade-footer">
            <div className="shade-footer-button" onClick={()=>this.jump('/login')}>
              ABOUT US
            </div>
          </div>
        </div>
      </div>
    )
  }
}
