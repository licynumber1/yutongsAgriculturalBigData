import React, { Component } from 'react';
import axios from "../common/request";
import {message} from "antd/lib/index";
import RP from '../components/propsRender'
import ShowPartFactory from '../shared/showPartFactory'
import { deepCompare } from '../utils/utils'
import {inject, observer} from "mobx-react/index";

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:用于为echarts工厂生成器获取配置值
//-----------------------------------------------------------------------------------------------
@inject('rootStore')
@observer
class GetDataConfigWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            echartsConfig:{},
        }
    }
    render() {
        return (
            this.props.chartsId ?
                (this.state.echartsConfig ?
                <RP
                    className= { this.props.className }
                    id = {this.state.echartsConfig.itemID || undefined}
                    title ={ this.state.echartsConfig.itemTitle || "" }
                    outterTitle={this.props.outterTitle}
                    getBoardById={this.props.getBoardById}
                    pageType={this.props.pageType}
                    isShow
                    width={this.props.width}
                    margin={this.props.margin}
                    full={this.props.full}
                >
                    <ShowPartFactory data={this.state.echartsConfig} pageType={this.props.pageType} outterTitle={this.props.outterTitle}/>
                </RP>
                 : null) :
                <RP
                    isShow
                    title=""
                    outterTitle={this.props.outterTitle}
                    pageType={this.props.pageType}
                    width={this.props.width}
                    margin={this.props.margin}
                    full={this.props.full}
                >
                    <ShowPartFactory data={{type:'add'}} outterTitle={this.props.outterTitle}/>
                </RP>
        );
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
        const id = this.props.id || urlArr[urlArr.length - 1] // url不同需要根据情况传入

        const url = this.props.pageType === "search" ? 'search' : 'item'

        //特殊判定，这几个id的数据很慢，需要传入pagesize，以后取消
        let addParse = {}
        if(chartsId === "45" || chartsId ==="47" ){
            addParse = {pageSize:"10"}
        }

        const parse = this.props.pageType === "search" ?
            {searchItemID:chartsId,contentID:id,...searchData,isCloseRobot,...addParse} :
            {boardID:urlArr[urlArr.length - 1],itemID:chartsId,...searchData,isCloseRobot,...addParse}
        this.setState({
            echartsConfig:{type:"loading"},
        })
        if(chartsId){
            axios.postJSONWithoutCancel(`fs/base/data/${url}/info`, parse).then(res=>{
                if(res && res.data && res.data.code === 200 && res.data.result){
                    this.setState({
                        echartsConfig:res.data.result
                    })
                }else{
                    this.setState({
                        echartsConfig:{}
                    })
                    message.error( (res && res.data && res.data.msg) || '获取图表配置失败');
                }
            })
        }
    }
}

GetDataConfigWrapper.propTypes = {
    //chartsId: PropTypes.string.isRequired
};

export default GetDataConfigWrapper;