/**
 * powered by 波比小金刚 at 2018-05-07 18:10:27
 * last modified by 波比小金刚 at 2018-05-07 18:10:27
 * @Description: 权限拦截
 */
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import {message} from "antd/lib/index";
import axios from "../../common/request";
import {inject, observer} from "mobx-react/index";
import { loginUrl,jumpUrl } from '../../utils/utils'
import PropTypes from 'prop-types';

@inject('rootStore')
@observer
export default class AuthRoute extends Component {
    constructor(props){
        super(props);
        this.state ={
          login:false
        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

  //TODO 权限验证
  componentDidMount(){
    if(!this.props.withoutCheck){
        this.check()
    }
  }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }

    getMenu = (flag) => {
        const { menuStore:{changeMenu},userStore:{userId} } = this.props.rootStore;
        const menu = [
          {
            board_name : "大气温度",
            create_date :1528797828000,
            del_flag :  0,
            id  : "0",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "大气湿度",
            create_date :1528797828000,
            del_flag :  0,
            id  : "1",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "土湿度",
            create_date :1528797828000,
            del_flag :  0,
            id  : "2",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "日雨量",
            create_date :1528797828000,
            del_flag :  0,
            id  : "3",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "雨量",
            create_date :1528797828000,
            del_flag :  0,
            id  : "4",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "风速",
            create_date :1528797828000,
            del_flag :  0,
            id  : "5",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "风向",
            create_date :1528797828000,
            del_flag :  0,
            id  : "6",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
          {
            board_name : "土温",
            create_date :1528797828000,
            del_flag :  0,
            id  : "7",
            update_date:1529635375000,
            user_id:"9376700c5ddc4ae3a9fd7159ecb28627"
          },
        ].map((v,i)=>{v.key=i;return v})
        changeMenu(menu)
        // axios.getWithoutCancel(`fs/base/data/board/get/menu`, {}).then(res=>{
        //     if(res && res.data && res.data.code === 200 && res.data.result){
        //         changeMenu(res.data.result)
        //         if(!flag){
        //             setTimeout(()=>this.jump('/renderSelf',{backUrl:'/'}),0)
        //         }
        //     }else if(userId){
        //         message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
        //     }
        // })
    }

  check = () => {
    this.getMenu(true)
  }

  jumpLogin = () => {
      window.location.href = `${jumpUrl}?callback=${
          window.location.href
          }&service=bdp`
  }

  render() {
    const {component: Component, render, ...rest} = this.props;
    return (
      <Route {...rest} render={props => Component ? <Component {...props}/> : render(props)}/>
    )
  }
}
