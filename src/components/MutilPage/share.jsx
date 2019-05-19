import React,{Component} from 'react'
import {Switch,message} from 'antd'
import copy from 'copy-to-clipboard'
import axios from "../../common/request";
import {inject, observer} from "mobx-react/index";

const urlArr = window.location.href.split('/')
const domain = `${urlArr[0]}//${urlArr[2]}/share`

@inject('rootStore')
@observer
export default class extends Component{
  constructor(props){
    super(props);
    this.state ={
      checked:false,
      shareUrl:"",
    }
  }

  changeShareUrl = (url) => {
    this.setState({
        shareUrl:url
    })
  }

  handleChange = checked=>{
    this.setState({checked})
      if(checked){
          const params = this.props.onShare()()
          const { userStore:{isCloseRobot} } = this.props.rootStore;
          params.isCloseRobot = isCloseRobot
          const parse = {
              boradID: this.props.id,
              params,
          }
          axios.postJSON(`fs/base/data/board/share`, parse).then(res=>{
              if(res && res.data && res.data.code === 200 && res.data.result){
                  this.changeShareUrl(res.data.result)
              }else{
                  message.error( (res && res.data && res.data.msg) || '获取分享链接失败');
              }
          })
      }else{
          const parse = {shareID:this.state.shareUrl}
          axios.postJSON(`fs/base/data/board/closeShare`, parse).then(res=>{
              if(res && res.data && res.data.code === 200 && res.data.result){
                  //this.changeShareUrl(res.data.result)
              }else{
                  //message.error( (res && res.data && res.data.msg) || '获取分享链接失败');
              }
          })
      }


  }
  handleCopy = ()=>{
    copy(`${domain}/${this.state.shareUrl}`);
    message.info('复制成功!!',1);
  }
  render(){
    const {checked} = this.state;
    return <div className="share-container">
      <div className="share-item">
        <div style={{height:"20px"}}>
          <div className="share-item-title">公开分享
            <span>{checked ? '' : '(未开启)'}</span>
          </div>
          <Switch onChange ={this.handleChange} />
        </div>
        <p style={{marginBottom:"0px"}}>开启后获得链接的人可以直接访问</p>
        {
          checked ?
          <div className="_copy">
            <span className="_href">
                {`${domain}/${this.state.shareUrl}`}
            </span>
            <label htmlFor="" onClick ={this.handleCopy}>复制链接</label>
          </div> : null
        }
      </div>
    </div>
  }
}