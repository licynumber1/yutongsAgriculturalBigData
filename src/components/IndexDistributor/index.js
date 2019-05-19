import React, { Component } from 'react'
import axios from "../../common/request";
import {message} from "antd/lib/index";
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:作为一个分发器,给Index页面分发首页.对于menu发生改变或未知的情况,可简化代码
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
        //删除面板时，需要重新制定新的首页
        this.getMenu()
    }

    getMenu() {//获取menu,并根据不同的情况分发首页
        // const { menuStore:{ changeMenu },userStore:{userId} } = this.props.rootStore;
        // axios.getWithoutCancel(`fs/base/data/board/get/menu`, {}).then(res=>{
        //     if(res && res.data && res.data.code === 200 && res.data.result){
        //         changeMenu(res.data.result)
        //         const urlArr = window.location.href.split('/')
        //         if(res.data.result.length && res.data.result[0] && res.data.result[0].id){
        //             const baseId = urlArr[urlArr.length - 1]
        //             const id = res.data.result[0].id
        //             if(id !== baseId){
        //                 this.context.router.history.push(`/data/${id}`)
        //             }
        //         }else if(urlArr[urlArr.length - 1] !== 'empty'){
        //             this.context.router.history.push(`/empty`)
        //         }
        //     }else if(userId){
        //         message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
        //     }
        // })
    }

    render() {
        return (
           <h1>等待加载...</h1>
        )
    }
}