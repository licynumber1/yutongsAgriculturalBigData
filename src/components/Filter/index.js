import React, { Component } from 'react'
import { Popover, Button, Icon } from 'antd'
import './index.less'
import {deepCompare} from "../../utils/utils";
export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            visible:false,
            url:window.location.href,
        }
    }

    componentWillReceiveProps(nextProps) {
        //当页面组件未发生变化但url变化时,需手动取消掉url
        const url = window.location.href
        if(url !== this.state.url){
            if(this.state.visible){//当url发生变化,并且filter组件开启状态 重置搜索条件
                this.props.handleReset()
            }
            this.setState({
                url,
                visible:false
            })
        }
    }

    changeVisible = (val) => {
        this.setState({
            visible:val === undefined ? !this.state.visible : val
        })
    }

    onSure = () => {
        this.props.handleSure()
        this.changeVisible()
    }

    onReset = () => {
        this.props.handleReset()
    }

    render() {
        return (
           <div className="filter">
               <Popover getPopupContainer={triggerNode => triggerNode.parentNode} content={
                   <div>
                       {this.props.children}
                       <div>
                           <div style={{height:'30px',width:"100%",textAlign:"right"}}>
                               <Button type="primary" onClick={this.onSure}>确定</Button>
                               <Button onClick={this.onReset}>重置</Button>
                           </div>
                       </div>
                   </div>
               } title={
                   <span>
                       筛选器
                       <Icon onClick={()=>this.changeVisible()}
                             style={{float:"right",lineHeight:"30px",cursor:"pointer"}} type="close" />
                   </span>
               } trigger="click" placement="topRight"
                 visible={this.state.visible}>
                   <div style={{cursor:"pointer",zIndex:'999999'}} onClick={()=>this.changeVisible()}>
                       <Icon type="filter" style={{fontSize:"25px"}}/>
                   </div>
               </Popover>
           </div>
        )
    }
}