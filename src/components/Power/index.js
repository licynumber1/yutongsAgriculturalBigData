import React, { Component } from 'react'
import { Switch } from 'antd'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
//by lee: 按钮修改权限
@inject('rootStore')
@observer
export default class extends Component {
    constructor(props){
        super(props)
        const { userStore:{changeIsCloseRobot} } = this.props.rootStore;
        const value =  localStorage.getItem("powerCheck") === 'true'

        changeIsCloseRobot(value ? "0" : "1")
        this.state = {
            checked:value
        }
    }
    handleChange = v => {
        localStorage.setItem("powerCheck",v)
        this.setState({
            checked:v
        })
       const { userStore:{changeIsCloseRobot} } = this.props.rootStore;
        changeIsCloseRobot(v ? "0" : "1")
        setTimeout(()=>this.jump('/renderSelf',{backUrl:this.context.router.route.location.pathname}),0)
    }
    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };
    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }
    render() {
        const { userStore:{power} } = this.props.rootStore;
        return (
            <div style={{marginLeft:"20px",marginRight:"20px"}}>
                {
                   ~~power === 1 ?
                       <Switch defaultChecked onChange={this.handleChange} checked={this.state.checked}/> :
                       null
                }
            </div>
        )
    }
}
