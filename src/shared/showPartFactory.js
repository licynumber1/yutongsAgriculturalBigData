import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataChart from '../components/datachart'
import HiddenTable  from './project/HiddenTable'
import { Spin  } from 'antd';
import { Link } from 'react-router-dom'
import {inject, observer} from "mobx-react/index";
import addItem from '../assets/svgEng/addItem.svg';
//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:用于根据数据类型选用不同的展示组件
//-----------------------------------------------------------------------------------------------

const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: '15%',
            render:(v)=><span>{++v}</span>,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
        },
        {
            title: '阅读量',
            dataIndex: 'view',
            key: 'view',
            width: '25%',
        },
    ]

@inject('rootStore')
@observer
class ShowPartFactory extends Component {
    getComponent = (data) => {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const {uiStore: {widthTag}} = this.props.rootStore;
        if(data && data.type){
            switch (data.type) {
                case 'table':
                    return <div style={{width:"100%",marginTop:this.props.height ? "20px" : "0px",overflowY: this.props.height ? "auto" : "scroll",
                                         maxHeight:this.props.height || "250px"}}>
                        <HiddenTable  columns={columns}
                                      pagination={this.props.pageType ? false : undefined}
                                      dataSource={data.itemDataList || []}/>
                    </div>
                case 'number':
                    return (
                        <div style={{textAlign:"center",height:"250px", lineHeight:"250px"}}>
                            <DataChart.Number data ={data.itemDataList[0] || "0"} />
                        </div>
                    )
                case 'add':
                    return <div style={{textAlign:'center',lineHeight:"216px",cursor:'pointer'}}>
                        <Link to={{pathname:`/add/${id}`,state :{ id:id ,outterTitle:this.props.outterTitle }}}>
                            <img alt="" style={{position:"relative",top:"3px",right:"0px"}} src={addItem}/>
                            <p style={{position:"relative",top:"-40px",lineHeight:"20px",color:"#cccccc"}}>新增报表</p>
                            {/*<Icon style={{fontSize:'160px',color:"#cccccc"}} type="plus-circle-o" />*/}
                        </Link>
                    </div>
                case 'loading':
                    return <div style={{textAlign:"center",
                        height:this.props.mapHeight ? this.props.mapHeight +"px" : "250px",
                        lineHeight:this.props.mapHeight ? this.props.mapHeight +"px" : "250px"}}>
                                <Spin />
                            </div>
                default:
                    return  <div><DataChart.Charts mapHeight={this.props.mapHeight} data={data} widthTag={widthTag}/></div>
            }
        }else{
            return <div style={{textAlign:"center",height:this.props.height ? this.props.height : "250px", lineHeight:this.props.height ? this.props.height : "250px"}}>
                暂无数据!
            </div>
        }
    }
    render() {
        const { data } = this.props
        return (
            this.getComponent(data)
        );
    }
}

ShowPartFactory.propTypes = {
    data: PropTypes.object.isRequired
};

export default ShowPartFactory;