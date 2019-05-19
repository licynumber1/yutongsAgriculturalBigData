import React,{Component} from 'react'
import { message } from 'antd'
import MultiTable from '../../shared/MultiTable'
import Breadcrumb from "../../components/Breadcrumb"
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react/index";
import axios from "../../common/request";

const renderImg = (src) => {
    return (
        <div style={{width:"100px",height:"100px",margin:"0 auto"}}>
            <img style={{display:"inline-block",width:"100px",height:"100px"}}
                 src={ src }></img>
        </div>
    )
}

const contentColumns = [
    {
        title: '内容封面',
        dataIndex: 'headUrl',
        key: 'headUrl',
        width: '16%',
        className: 'column-center',
        render:renderImg,
    },

    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: '16%',
        className: 'column-center',
    },

    {
        title: '所属频道',
        dataIndex: 'channelName',
        key: 'channelName',
        width: '16%',
        className: 'column-center',
    },

    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '16%',
        className: 'column-center',
    },

    {
        title: '创建者',
        dataIndex: 'author',
        key: 'author',
        width: '16%',
        className: 'column-center',
    },

    {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '20%',
        className: 'column-center',
    },
]

const channelColumns = [
    {
        title: '频道封面',
        dataIndex: 'headUrl',
        key: 'headUrl',
        width: '16%',
        className: 'column-center',
        render:renderImg,
    },

    {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: '20%',
        className: 'column-center',
    },

    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        className: 'column-center',
    },

    {
        title: '创建者',
        dataIndex: 'author',
        key: 'author',
        width: '20%',
        className: 'column-center',
    },

    {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        width: '20%',
        className: 'column-center',
    },
]

const userColumns = [
    {
        title: '头像',
        dataIndex: 'headUrl',
        key: 'headUrl',
        width: '16%',
        className: 'column-center',
        render:renderImg,
    },

    {
        title: '账号',
        dataIndex: 'userName',
        key: 'userName',
        width: '10%',
        className: 'column-center',
    },

    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        width: '10%',
        className: 'column-center',
    },

    {
        title: '所属文化云和角色',
        dataIndex: 'roleName',
        key: 'roleName',
        width: '10%',
        className: 'column-center',
    },

    {
        title: '用户来源',
        dataIndex: 'from',
        key: 'from',
        width: '10%',
        className: 'column-center',
    },

    {
        title: '终端',
        dataIndex: 'os',
        key: 'os',
        width: '10%',
        className: 'column-center',
    },

    {
        title: '注册时间',
        dataIndex: 'registDate',
        key: 'registDate',
        width: '15%',
        className: 'column-center',
    },

    {
        title: '最近登陆时间',
        dataIndex: 'recentlyDate',
        key: 'recentlyDate',
        width: '15%',
        className: 'column-center',
    },
]

@inject('rootStore')
@observer
export default class extends Component{

    constructor(props){
        super(props)
        this.state = {
            type:undefined,
            dataSource:[],
            total:0,
        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    getColumns = () => {
        switch (this.state.type){
            case 'content':
                return contentColumns;
            case "user":
                return userColumns;
            case "channel":
                return channelColumns
            default:
                return []
        }
    }

    componentDidMount(){
        if(this.context.router.route.location.state && this.context.router.route.location.state.parse){
            this.getData(this.context.router.route.location.state.parse)
        }else{
            const urlArr = window.location.href.split('/')
            const id = urlArr[urlArr.length - 1]
            const contentID = urlArr[urlArr.length - 2]
            this.jump(`/details/${contentID}/${id}`)
            message.error("请在详情页选择下钻数据的筛选项")
        }
    }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }

    getData = (parse) => {
        axios.postJSONWithoutCancel(`fs/base/data/drill/info`,parse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                console.log(res.data.result)
                this.setState({
                    dataSource:res.data.result.drillVos,
                    total:res.data.result.total,
                    type:res.data.result.type,
                })
            }else{
                message.error( (res && res.data && res.data.msg) || '获取表格数据失败');
            }
        })
    }

    onChange = (parse) => {
        if(this.context.router.route.location.state && this.context.router.route.location.state.parse){
            this.context.router.route.location.state.parse.itemForm =
                {...this.context.router.route.location.state.parse.itemForm,beginIndex:parse.current,pageSize:parse.pageSize}
            this.getData(this.context.router.route.location.state.parse)
        }
    }

    getBreadcrumbOption = () => {
        let BreadcrumbOption = []
        if(this.context.router.route.location.state && this.context.router.route.location.state.BreadcrumbOption){
            BreadcrumbOption = this.context.router.route.location.state.BreadcrumbOption
            let label
            switch (this.state.type){
                case 'content':
                    label = "内容详情页"
                    break;
                case "user":
                    label = "用户详情页"
                    break;
                case "channel":
                    label = "频道详情页"
                    break;
                default:
                    label = "数据下钻"
            }
            console.log(label)
            BreadcrumbOption[BreadcrumbOption.length-1].name = label
        }
        return BreadcrumbOption
    }

    render(){
        return (
            <div className='empty-container'>
                <Breadcrumb BreadcrumbOption={this.getBreadcrumbOption()}></Breadcrumb>
                <MultiTable columns={this.getColumns()} dataSource={this.state.dataSource} withTotal={false}
                            total={this.state.total} onChange={this.onChange}
                />
            </div>
        )
    }
}