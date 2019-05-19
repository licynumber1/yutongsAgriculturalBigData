import React, { Component } from 'react'
import { Breadcrumb } from 'antd'
import PropTypes from "prop-types";
export default class extends Component {
    constructor(props){
        super(props)
        this.state = {

        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    jump = (url) => {
        const length = this.props.BreadcrumbOption.length - this.props.BreadcrumbOption.findIndex(i=>i.jumpUrl === url) - 1
        for(let i=0;i< length;i++){
            this.context.router.history.goBack()
        }
    }

    render() {
        return (
            this.props.BreadcrumbOption && this.props.BreadcrumbOption.length && this.props.BreadcrumbOption.length >=2 ?
            <div style={{width:"100%",lineHeight:"42px"}}>
                <Breadcrumb style={{lineHeight:"42px"}}>
                    {
                        this.props.BreadcrumbOption.map((i,index)=>{
                            return <Breadcrumb.Item key={index}
                                                     style={this.props.BreadcrumbOption.length - 1 === index ? {} :{cursor: "pointer"}}
                                                     onClick={()=>this.jump(i.jumpUrl)}>{i.name}</Breadcrumb.Item>
                        })
                    }
                </Breadcrumb>
            </div> : null)
    }
}