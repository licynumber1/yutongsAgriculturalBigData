import  React,{Component } from 'react'
import { Select, Icon, Input, Button, message, notification } from 'antd'
import NoRepeatButton from '../../shared/project/noRepeatButton'
import './index.less'
import PropTypes from "prop-types";
import { loginApi ,registerApi } from './api'

export default class extends Component{
  static contextTypes = {
    location: PropTypes.object,
    router: PropTypes.object.isRequired
  };

  jump = (url,state) => {
    this.context.router.history.push({pathname:url,state})
  }

  state = {
    user:"",
    password:"",
  }

  userList = [
    {
      user:"yutong",
      password:"123456"
    },
    {
      user:"lee",
      password:"1234567"
    },
  ]

  changeData = (value,key) => {
    this.setState({
      [key]:value
    })
  }

  login = async () => {
    const { user ,password } = this.state

    let data = await loginApi({
      username:user ,password
    })

      if(data.data.ret === 200){
          notification.success({ message: '登录成功', description: '成功登入大数据平台' })
          this.jump('/data/0')
      }else{
          notification.error({ message: '登录失败', description: data.data.msg ||'密码错误' })
      }

    //   let hasUser = (user) => {
    //       return this.userList.some(i=>i.user===user)
    //   }
    //
    //   let userIndex = this.userList.findIndex(i=>i.user===user)
    //
    // if(!hasUser){
    //   notification.error({ message: '登录失败', description: '没有此用户' })
    // }else{
    //  if(this.userList[userIndex].password === password){
    //    notification.success({ message: '登录成功', description: '成功登入大数据平台' })
    //    this.jump('/data/0')
    //  }else{
    //    notification.error({ message: '登录失败', description: '密码错误' })
    //  }
    // }
  }

  register = async () => {
    const { user ,password,inviteCode } = this.state
      let data = await registerApi({
          username:user ,password,inviteCode
      })
    const { userList } = this
    const userIndex = userList.findIndex(i=>(i.user === user))
    const hasUser = (userIndex!== -1)
    if(hasUser){
      notification.error({ message: '注册失败', description: '已有该用户' })
    }else{
      if(user.length >= 6 && user.length <= 12 && password.length>= 6 && password.length <= 12){
        notification.success({ message: '注册成功', description: `用户名:${user},密码:${password}。游客登录仅当次有效,关闭窗口后请重新注册` })
        this.userList.push( {
          user,
          password
        },)
      }else{
        notification.error({ message: '注册失败', description: '用户名和密码至少6位,且不超过12位' })
      }
    }
  }

  render(){
    return (
      <div className="lee-login">
        <div className="shade"></div>
        <div className="label">
          <div className="shade-label shade-top"></div>
          <div className="shade-label shade-footer">
          </div>
        </div>
        <div className="form-wrapper">
          <div className="form">
            <div style={{marginTop:"20px",marginBottom:"20px"}}>大数据平台登录系统</div>
            <Input style={{marginTop:"10px"}} placeholder={"用户名"} onChange={(e)=>this.changeData(e.target.value,"user")}/>
            <Input style={{marginTop:"10px"}} placeholder={"密码"} onChange={(e)=>this.changeData(e.target.value,"password")}/>
            <Input style={{marginTop:"10px",marginBottom:"10px"}} placeholder={"邀请码(注册才需要)"} onChange={(e)=>this.changeData(e.target.value,"inviteCode")}/>
            <div>
              <NoRepeatButton style={{marginRight:"15px"}} type="primary" onClick={this.login}>登录</NoRepeatButton>
              <NoRepeatButton onClick={this.register}>注册</NoRepeatButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
