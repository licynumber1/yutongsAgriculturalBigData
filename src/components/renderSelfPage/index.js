import React, { Component } from 'react'
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:作为一个刷新器组件
//-----------------------------------------------------------------------------------------------

@inject('rootStore')
@observer
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    componentDidMount(){
        console.log(this.context.router.route.location)
        this.jump(this.context.router.route.location.state.backUrl)
    }

    jump = (url) => {
        this.context.router.history.push(url)
    }

    render() {
        return (
            <h1>等待加载...</h1>
        )
    }
}