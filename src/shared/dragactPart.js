import React,{Component} from 'react'
import GetDataConfigWrapper from './getDataConfigWrapper'
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react/index";
import './renderDragactArray.less'
import EasyDragSort from "../shared/project/EasyDragSort"
import {message} from "antd/lib/index";
import axios from "../common/request";
import qs from 'qs'

@inject('rootStore')
@observer
class RenderDragactArray extends Component{
    constructor(props){
        super(props)
        this.state = {
            curMoveItem:0,
            data:this.props.data,
            nowItem:undefined,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            data:nextProps.data
        })
    }

    handleDragMove = (data, from, to) => {
       if(this.props.full){
        //全屏不允许移动
       }else{
           const { editorModal=false } = this.props.rootStore.uiStore.modalList;
           if(editorModal && (!data.some(i=>i===undefined) || ( data.some(i=>i===undefined) && data[data.length-1] === undefined) ) ){
               this.setState({
                   curMoveItem: to,
                   data: data
               })
               const urlArr = window.location.href.split('/')
               const id = urlArr[urlArr.length - 1]
               const itemIDs = data.filter(i=>i!==undefined)
               const parse = {boardID:id,itemIDs:itemIDs}
               axios.postJSONWithoutCancel(`fs/base/data/board/order`, parse).then(res=>{
                   if(res && res.data && res.data.code === 200){
                       message.success("修改顺序成功")
                       this.props.changeState(data)
                   }else{
                       message.error( (res && res.data && res.data.msg) || '修改顺序失败');
                   }
               })
           }
       }
    }

    handleDragEnd = (data, from, to)=>{
        this.setState({
            curMoveItem: null
        })
    }

    handleDragStart = (e) => {
        this.setState({
            nowItem:e,
        })
    }

    render(){
        const { data, width, ...other } = this.props
        return (
            <EasyDragSort onDragStart={this.handleDragStart} onDragEnd={this.handleDragEnd} onChange={this.handleDragMove} data={this.state.data}>
                {
                    this.state.data.map((j,index)=>{
                        if(j === undefined){
                            return (
                            <div className={this.state.curMoveItem === index? 'item active' : 'item'}
                                 style={{width:width}}
                                 key={j}
                            >
                                <GetDataConfigWrapper chartsId={j} key={index} {...other}/>
                            </div>)
                        }
                        return (
                                <div className={'item'}
                                     style={{width:width}}
                                     key={j}
                                >
                                    <GetDataConfigWrapper chartsId={j} key={index} {...other}/>
                                </div>
                        )
                    }
                    )
                }
            </EasyDragSort>

        )
    }
}

RenderDragactArray.propTypes = {
    data: PropTypes.array.isRequired
};

export default RenderDragactArray