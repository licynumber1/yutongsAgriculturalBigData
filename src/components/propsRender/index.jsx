import React,{Component} from 'react'
import './index.less'
import { Icon , Popconfirm } from 'antd'
import {inject, observer} from "mobx-react/index";
import { Link } from 'react-router-dom';
import {message} from "antd/lib/index";
import axios from "../../common/request";

@inject('rootStore')
@observer
export default class extends Component{
  constructor(props){
    super(props);
    this.state ={
    }
  }
  onConfirm = () => {
      const urlArr = window.location.href.split('/')
      const id = urlArr[urlArr.length - 1]
      const parse = {
          boardID:id,
          itemID:this.props.id,
      }
      axios.del(`fs/base/data/item/delete`, parse).then(res=>{
          if(res && res.data && res.data.code === 200 && res.data.result){
              message.success('删除报表成功')
              if(this.props.getBoardById){//删除刷新回调
                  this.props.getBoardById()
              }
          }else{
              message.error( (res && res.data && res.data.msg) || '删除报表失败');
          }
      })
  }

  getJumpUrl = (type) => {
      switch(type){
          case "search":
              return "searchDetails";
          case "data":
              return "details";
          case "share":
              return "shareDetails";
          default:
              return "details"
      }
  }

  render(){
    const {className,title='默认标题',id,outterTitle} = this.props;
    const urlArr = window.location.href.split('/')
    const itemId = urlArr[urlArr.length - 2]
    const outterId = urlArr[urlArr.length - 1]
    const urlIdpart = this.props.pageType === "search" ? `${itemId}/${id}` : `${outterId}/${id}`
    const { editorModal=false } = this.props.rootStore.uiStore.modalList;
    const jumpUrl = this.getJumpUrl(this.props.pageType)
    const width = this.props.width ? { width:this.props.width } : {}
    const margin = this.props.margin ? { margin:this.props.margin } : {}
    return <div className={`props-container ${className}`} style={{...width,...margin}}>
      <div className="porps-header">
      <h3>
          {
              this.props.full ?
                      <b><span style={{color:'#111111',fontSize:'18px',fontWeight:"600",height:"20px"}}>{title}</span></b>
                  :
                  <Link to={{pathname:`/${jumpUrl}/${urlIdpart}`,state :{ title: title,id:outterId,outterTitle:outterTitle }}}>
                      <b><span style={{color:'#111111',fontSize:'18px',fontWeight:"600",height:"20px"}}>{title}</span></b>
                  </Link>
          }
      </h3>
      <span className='icon-wrapper'>
        {
            (!this.props.full && editorModal && id) ?
              <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={this.onConfirm}>
                  <Icon type="close"/>
              </Popconfirm> : null
        }
      </span>
      
      </div>
      <div className="props-content">
        {this.props.children}
      </div>
    </div>
  }
}