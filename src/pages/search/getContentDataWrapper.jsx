import React, { Component } from 'react';
import axios from "../../common/request";
import {message} from "antd/lib/index";
import {deepCompare, toThousands} from '../../utils/utils'
import './index.less'
import {inject, observer} from "mobx-react/index";

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:用于为echarts工厂生成器获取配置值
//-----------------------------------------------------------------------------------------------
@inject('rootStore')
@observer
class getContentDataWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            echartsConfig:undefined,
        }
    }

    checkData = (data) => {
        if(typeof data === 'string' || typeof data === 'number'){
            return toThousands(~~data)
        }else{
            return "后台数据出错"
        }
    }

    render() {
        const item = this.state.echartsConfig
        return (
            this.props.chartsId ?
                (this.state.echartsConfig ?
                        <div>
                            <div>
                                <p>{item.itemTitle || "未获得数据名称"}</p>
                                <span>
                                    { (item && item.itemDataList && item.itemDataList[0] && this.checkData(item.itemDataList[0])) || 0}
                                    </span>
                            </div>
                        </div>
                  : ""
                ) : ""
        )
    }

    componentDidMount (){
        if(this.props.chartsId){
            this.fetchData(this.props)
        }
    }

    componentWillReceiveProps(nextProps) {
        //id未发生改变不刷新
        const shouldReFetchData = (nextProps.chartsId !== this.props.chartsId) || !deepCompare(this.props.searchData,nextProps.searchData) || (nextProps.id !== this.props.id)
        if(shouldReFetchData){
            this.fetchData(nextProps)
        }
    }

    fetchData = (props) => {
        const { searchData,chartsId } = props
        const { userStore:{isCloseRobot} } = this.props.rootStore;
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 2]
        const url = this.props.pageType === "search" ? 'search' : 'item'
        const parse = this.props.pageType === "search" ?
            {searchItemID:chartsId,contentID:id,...searchData,isCloseRobot} :
            {itemID:chartsId,...searchData,isCloseRobot}
        this.setState({
            echartsConfig:{type:"loading"},
        })
        axios.postJSONWithoutCancel(`fs/base/data/${url}/info`, parse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.setState({
                    echartsConfig:res.data.result
                })
            }else{
                this.setState({
                    echartsConfig:{},
                })
                message.error( (res && res.data && res.data.msg) || '获取图表配置失败');
            }
        })
    }
}

getContentDataWrapper.propTypes = {
    //chartsId: PropTypes.string.isRequired
};

export default getContentDataWrapper;