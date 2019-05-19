/**
 * powered by 波比小金刚 at 2018-05-21 17:27:17 
 * last modified by 波比小金刚 at 2018-05-21 17:27:17 
 * @Description: 用户登录组件 
*/
import React, { Component } from 'react';
import './index.less';
import {inject, observer} from "mobx-react/index";
import { Popover, message } from 'antd'
import axios from "../../common/request";
import {jumpUrl, loginUrl} from '../../utils/utils'
import PropTypes from "prop-types";
import logo from '../../assets/icons/fishsayingSmall.svg';

@inject('rootStore')
@observer
class UserLogin extends Component {
    jumpLogin = () => {
        //window.location.href = `${jumpUrl}?service=bdp&callback=${window.location.href}`
      this.jump('/login')
    }

  static contextTypes = {
    location: PropTypes.object,
    router: PropTypes.object.isRequired
  };

  jump = (url,state) => {
    this.context.router.history.push({pathname:url,state})
  }

  logout = () => {
    message.success('退出登录成功')
    setTimeout(()=>{
      this.jumpLogin()
    },200)
      // const { menuStore:{ changeMenu },userStore:{changeIsCloseRobot} } = this.props.rootStore;
      // axios.postJSON(`${loginUrl}sso/logout/`, {}).then(res=>{
      //     if(res && res.status === 200){
      //         message.success('退出登录成功')
      //         changeMenu([])
      //         changeIsCloseRobot("0")
      //         localStorage.setItem("powerCheck","true")
      //         setTimeout(()=>{
      //             this.jumpLogin()
      //         },200)
      //     }else{
      //         message.error( (res && res.data && res.data.msg) || '获取登录数据失败');
      //     }
      // })
  }

    explain = () => {
        window.open("https://shimo.im/docs/UVLM61Ts1cQ2z5RP/")
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

  render() {
    const { userName,userIcon } = this.props.rootStore.userStore
      const content = (
          <div style={{width:"100px",textAlign:"center"}}>
              {/*<span onClick={this.explain} style={{cursor:'pointer',lineHeight:"30px"}}>使用说明</span>*/}
              {/*<br/>*/}
              <span onClick={this.logout} style={{cursor:'pointer',lineHeight:"30px"}}>登出</span>
          </div>
      );
    return (
        <Popover placement="bottom" content={content} trigger="hover">
          <div className='ht-user-login-box'>
             <img src={userIcon || logo} alt='头像'/>
             <div>{userName}</div>
          </div>
        </Popover>
    );
  }
}

export default UserLogin;
