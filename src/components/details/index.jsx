import  React,{Component } from 'react'
import { Select, Icon, Input, Button, message, Upload } from 'antd'
import './index.less'
import MultiTable from '../../shared/MultiTable/index'
import Date from '../../components/datePicker'
import axios from "../../common/request";
import ShowPartFactory from '../../shared/showPartFactory'
import moment from "moment/moment";
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
import download from "../../shared/project/download";
import OutputSpan from '../../shared/MultiTable/outputSpan'
import AreaSelect from '../../components/AreaSelect'
import Range from '../../components/range'
import {lengthValidator, requireValidator} from "../../shared/validator";
import qs from "qs";
import Filter from "../../components/Filter"
import Breadcrumb from "../../components/Breadcrumb"
import { listData,businessLinesData } from "../../constant"
import PopoverSpan from "../../shared/project/PopoverSpan"

const initState = {
    id:undefined,
    errMsg:undefined,
    provincesId:undefined,
    cityId:undefined,
    districtId:undefined,
    businessLines:businessLinesData[0].value,
    height:800,
    list:listData,
    timeType:listData[0].value,
    dataSource:[],
    dateConfig:{},
    total:0,
    pageSize:'20',
    current:1,
    startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate:moment().format('YYYY-MM-DD'),
    itemList:[],
    echartsConfig:{},
    province:undefined,
    city:undefined,
    district:undefined,
    editState:false,
    options:{
        startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate:moment().format('YYYY-MM-DD'),
    },
}

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: '15%',
        className: 'column-center',
    },
]

@inject('rootStore')
@observer
export default class extends Component{
    constructor(props){
        super(props);
        this.state ={
            ...initState
        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    componentDidMount() {
        const { current,pageSize } = this.state
        this.onSearch({current,pageSize})
    }

    handleChange = ([startDate,endDate]) => {
        this.changeStateAndSearch({
            startDate:startDate.format('YYYY-MM-DD'),
            endDate:endDate.format('YYYY-MM-DD'),
        })
    }

    changeStateAndSearch = (data) => {
        this.setState(data)
        this.onSearch(data)
    }

    toNumber = (str) => {
        return ~~str
    }

    toString = (num) => {
        return num+""
    }

    onSearch = (config) => {//表格页码变化config
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const contentID = urlArr[urlArr.length - 2]
        const { pageSize,current,startDate,endDate,timeType,provincesId, cityId, districtId,businessLines } = this.state
        const initConfig = {
            pageSize,
            current,
            startDate,
            endDate,
            timeType,
            provincesId,
            cityId,
            districtId,
            businessLines,
        }
        const parse = Object.assign({},initConfig,config,{id})

        const addParse =  this.props.detailsType === "search" ? {searchItemID:id,contentID,} : {itemID: id,boardID:contentID}
        console.log(this.props)
        const tableParse = {
            endDate: parse.endDate,
            startDate: parse.startDate,
            pageSize:parse.pageSize,
            beginIndex:parse.current,
            timeType:parse.timeType,
            province:parse.provincesId,
            city:parse.cityId,
            district:parse.districtId,
            businessLines:parse.businessLines,
            ...addParse
        }

        const chartsParse = {
            endDate: parse.endDate,
            startDate: parse.startDate,
            timeType:parse.timeType,
            province:parse.provincesId,
            city:parse.cityId,
            district:parse.districtId,
            businessLines:parse.businessLines,
            ...addParse
        }
        this.getTableData(tableParse)
        this.getChartsData(chartsParse)
    }

    //获取表格和图表的方法
    getTableData = (tableParse) => {
        const url = this.props.detailsType === "search" ? "search" : "item"
        const { userStore:{isCloseRobot} } = this.props.rootStore;
        tableParse.isCloseRobot = isCloseRobot
        axios.postJSONWithoutCancel(`fs/base/data/${url}/info`, tableParse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.setState({
                    itemList:this.fixTableData(res.data.result),
                    total:res.data.result.count,
                    itemTitle:res.data.result.itemTitle,
                    des:res.data.result.newDes,
                    newName:res.data.result.itemTitle,
                    newDes:res.data.result.newDes,
                })
            }else{
                message.error( (res && res.data && res.data.msg) || '获取表格数据失败');
            }
        })
    }

    fixTableData = (result) => {
        const output = JSON.parse(JSON.stringify(result))
        if(output.type === "pie" && output.itemDataList){
            output.itemDataList.forEach(i=>{
                i.datas = {所有日期:i.value}
            })
        }
        return output
    }

    getChartsData = (chartsParse) => {
        const url = this.props.detailsType === "search" ? "search" : "item"
        const { userStore:{isCloseRobot} } = this.props.rootStore;
        chartsParse.isCloseRobot = isCloseRobot
        this.setState({
            echartsConfig:{type:"loading"},
        })
        axios.postJSONWithoutCancel(`fs/base/data/${url}/info`, chartsParse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.setState({
                    echartsConfig:res.data.result,
                })
            }else{
                this.setState({
                    echartsConfig:{},
                })
                message.error( (res && res.data && res.data.msg) || '获取图表数据失败');
            }
        })
    }

    getDataSource = (data,flag) => {
        if(flag){
            return []
        }
        let outputData = []
        const forEachData = data ? data : (this.state.itemList ? ( this.state.itemList.itemDataList || [] ): [])

        if(this.state.itemList && this.state.itemList.type === "pie"){
            const data = (forEachData || []).map(i=>{
                if(typeof i === "object"){
                    i.date = i.label || i.date
                    i.label = undefined
                }
                return i
            })
            return data
        }

        forEachData.forEach((i,index)=>{
            const titleArr = (this.state.itemList && this.state.itemList.label) ? (this.state.itemList.label || "").split(",") : []
            if(typeof i === "object"){
                i.label = titleArr[index+1] || i.label || "number"
                for(let j in i.datas){
                    const index = outputData.findIndex(k=>k.date === j)
                    const noRepeatTag = index === -1
                    const addData = {date:j,[i.label]:i.datas[j]}
                    if(noRepeatTag){
                        outputData.push(addData)
                    }else{
                        Object.assign(outputData[index],addData)
                    }
                }
            }
        })
        return outputData
    }

    jumpDrillDown = (key,label,val) => {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const contentID = urlArr[urlArr.length - 2]
        const pageType = urlArr[urlArr.length - 3]

        const noDrillArray = [34,33,29,30]
        if(noDrillArray.findIndex(i=> (~~i===~~id) ) !== -1){
            message.warning("所选项不支持下钻")
            return
        }

        const { userStore:{isCloseRobot} } = this.props.rootStore;
        const state = this.state
        const addParse =  this.props.detailsType === "search" ? {searchItemID:id,contentID,} : {itemID: id}
        const tableParse = {
            endDate: state.endDate,
            startDate: state.startDate,
            pageSize:state.pageSize,
            beginIndex:state.current,
            timeType:state.timeType,
            province:state.provincesId,
            city:state.cityId,
            district:state.districtId,
            businessLines:state.businessLines,
            ...addParse
        }
        tableParse.isCloseRobot = isCloseRobot
        const filterParse = {
            boardID:contentID,
            itemID:id,
            ...tableParse
        }
        console.log(key,label,filterParse)
        //qs.stringify
        const parse = ({
            itemForm: {
                ...filterParse
            },
            paramX: key,
            paramY: label,
        })
        const getData = () => {

        }

        const title = this.context.router.route.location.state ? this.context.router.route.location.state.title :
            (this.state.itemTitle || "")
        let BreadcrumbOption = [
            {
                name:title,
                jumpUrl:`/${+pageType}/${this.context.router.route.match.params.id}`,
            }
        ]
        if(this.context.router.route.location.state && this.context.router.route.location.state.id){
            BreadcrumbOption = [
                {
                    name:this.context.router.route.location.state.outterTitle,
                    jumpUrl:`/${pageType === "shareDetails" ? "share" : "data"}/${this.context.router.route.location.state.id}`,
                },
                {
                    name:title,
                    jumpUrl:`/${+pageType}/${this.context.router.route.match.params.id}`,
                },
                {
                    name:"数据下钻",
                    jumpUrl:`/${pageType === "shareDetails" ? "shareDrillDown" : "drillDown"}/${id}`,
                },
            ]
        }
        this.jump(`/${pageType === "shareDetails" ? "shareDrillDown" : "drillDown"}/${contentID}/${id}`,{BreadcrumbOption:BreadcrumbOption,parse:parse})
    }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }

    getColumns = (columns,outputData,flag) => {
        if(flag){
            return []
        }
        //这里的逻辑有点乱
        //写个注释
        const newColumns = columns.map(i=>i)
        const addItems = outputData.map(i=>i.label || i.date)
        const width = (85 / (addItems.length || 1))+'%'
        const length = this.getDataSource().length
        const titleArr = (this.state.itemList && this.state.itemList.label) ? (this.state.itemList.label || "").split(",") : []
        newColumns[0].title = titleArr.length > 0 ? titleArr[0] : "内容类型"

        if(this.state.itemList && this.state.itemList.type === "pie"){
            newColumns.push(
                {
                    title: titleArr[1] || "内容数",
                    dataIndex: "value",
                    key: "value",
                    width: "85%",
                    className: 'column-center',
                    render: (val,row,index) => {
                        return <span className={ index < length ? "hands" : "" } onClick={
                            index < length ? ()=>this.jumpDrillDown(row.date,"内容数",val) : ()=>{}
                        }
                        >{val}</span>
                    }
                },
            )
            return newColumns
        }
        //对于饼图的表格

        addItems.forEach((v,i)=>{
            if(i < titleArr.length - 1){
                newColumns.push(
                    {
                        title: titleArr[i+1] || v || "暂无",
                        dataIndex: titleArr[i+1] || v || "暂无",
                        key: i,
                        width: width,
                        className: 'column-center',
                        render: (val,row,index) => {
                            return <span className={ index < length ? "hands" : "" } onClick={
                                index < length ? ()=>this.jumpDrillDown(row.date,v,val) : ()=>{}
                            }
                            >{val}</span>
                        }
                    },
                )
            }
        })
        const tagData = (this.state.itemList && this.state.itemList.firstIndex)
        if(tagData){
            newColumns[0].title = tagData
        }
        return newColumns
    }

    output = () => {
        const { startDate,endDate } = this.state
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const parse = {
            startDate:startDate,
            endDate:endDate,
            itemId:id,
        }
        axios.postJSON(`fs/base/data/share/excel/`, parse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                //message.success(res.data.result)
                download(res.data.result)
            }else{
                message.error( (res && res.data && res.data.msg) || '下载excel失败');
            }
        })
    }

    onSelect = (e) => {
        this.changeStateAndSearch({
            timeType:e
        })
    }

    handleAreaChange = (data) => {
        const { provincesId,cityId,districtId } = data
        this.setState({
            options:{
                ...this.state.options,provincesId,cityId,districtId
            }
        })
    }

    mobileAndShareTag = () => {
        return (this.props.detailsType === "share" && this.isMobile())
    }

    isMobile = () => {
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad:false
        };
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") === 0;
        system.mac = p.indexOf("Mac") === 0;
        system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) !== null)?true:false;
        //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
        if (system.win || system.mac || system.xll||system.ipad) {
            return false
        } else {
            return true
        }
    }

    onReadEdit = (val) => {
        this.setState({
            editState:!this.state.editState
        })
        if(val){
            this.saveName()
        }
    }

    handleTitleChange = (e) => {
        this.setState({
            newName: e.target.value
        })
    }

    handleDesChange = (e) => {
        this.setState({
            newDes: e.target.value
        })
    }

    saveName = () => {
        const boardID = this.context.router.route.match.params.itemId
        const name = this.state.newName
        const des = this.state.newDes
        const itemID = this.context.router.route.match.params.id
        const parse = qs.stringify({boardID,itemID,name,des})

        const lengthValidator = (val,max,min=1) => {
            return val.length <= max && val.length >= min
        }
        const nameLength = 10
        const descriptLength = 100
        const isSpace = val => val === undefined  || val === null || val === ""
        const nameValidator = (name && lengthValidator(name,nameLength)) || isSpace(name)
        const descriptValidator = (des && lengthValidator(des,descriptLength)) || isSpace(des)
        const validator = nameValidator && descriptValidator

        if(validator){
            if(this.state.itemTitle !== this.state.newName || this.state.des !== this.state.newDes){
                axios.postJSONWithoutCancel(`fs/base/data/item/update?${parse}`).then(res=>{
                    if(res && res.data && res.data.code === 200 && res.data.result){
                        message.success( (res && res.data && res.data.msg) || '保存指标成功');
                        this.onSearch({pageSize:'20',current:1,})
                    }else{
                        message.error( (res && res.data && res.data.msg) || '保存指标失败');
                    }
                })
            }
        }else{
            const str = (nameValidator ? "" : "名称长度过长") + (descriptValidator ? "" : "描述长度过长")
            message.error(str)
        }
    }

    handleChange =([startDate, endDate])=>{
        this.setState({
            options:{
                ...this.state.options,
                startDate:startDate.format('YYYY-MM-DD'),
                endDate:endDate.format('YYYY-MM-DD'),
            }
        })
    }

    handleRangeChange = (data) => {
        this.setState({
            options:{
                ...this.state.options,timeType:data
            }
        })
    }

    handleBusinessLinesChange = (data) => {
        this.setState({
            options:{
                ...this.state.options,businessLines:data
            }
        })
    }

    handleAreaChange = (data) => {
        const { provincesId,cityId,districtId } = data
        this.setState({
            options:{
                ...this.state.options,provincesId,cityId,districtId
            }
        })
    }

    handleSure = () => {
        this.setState({
            ...this.state.options
        },()=>this.onSearch(this.state.options))
    }

    handleReset = () => {
        this.refs.area.reset()
        this.refs.range.reset()
        // this.refs.businessLines.reset()

        this.setState({
            startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
            endDate:moment().format('YYYY-MM-DD'),
            provincesId:undefined,
            cityId:undefined,
            districtId:undefined,
            timeType:listData[0].value,
            businessLines:businessLinesData[0].value,
            options:{
                startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endDate:moment().format('YYYY-MM-DD'),
            },
        },()=>this.onSearch(this.state.options))
    }

    render(){
        const {startDate, endDate, list,itemList,echartsConfig,editState,options} = this.state
        const des = this.state.echartsConfig.des || this.state.itemList.des
        const outputData = (echartsConfig && echartsConfig.itemDataList) ? this.fixTableData(echartsConfig).itemDataList : []

        //输出数据与图表数据对比,存在的才输出
        const title = (this.state.itemTitle || "")

        let BreadcrumbOption = [
            {
                name:title,
                jumpUrl:"/details/"+this.context.router.route.match.params.id,
            }
        ]
        if(this.context.router.route.location.state && this.context.router.route.location.state.id){
            BreadcrumbOption = [
                {
                    name:this.context.router.route.location.state.outterTitle || "分享看板",
                    jumpUrl:"/data/"+this.context.router.route.location.state.id,
                },
                {
                    name:title,
                    jumpUrl:"/details/"+this.context.router.route.match.params.id,
                }
            ]
        }
        return (
            <div className='empty-container'>
                <Breadcrumb BreadcrumbOption={BreadcrumbOption}></Breadcrumb>
                <div>
                    <div style={{width:'400px',display:"inline-block",position:"relative",top:"-10px"}}>
                        {
                            editState ?
                                <div style={{width:'400px',height:"70px",lineHeight:"70px",display:"inline-block"}}>
                                    <span style={{display:'inline-block'}}>
                                        <label>报表名称:</label>
                                        <Input
                                            style={{marginLeft:"20px",width:"260px"}}
                                            defaultValue={title}
                                            onChange={this.handleTitleChange}
                                        />
                                     </span>
                                    <br/>
                                    <span style={{display:'inline-block'}}>
                                         <label>备注信息:</label>
                                        <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }}
                                                        style={{marginLeft:"20px",width:"260px"}}
                                                        defaultValue={des}
                                                        onChange={this.handleDesChange}/>
                                     </span>
                                </div> :
                                <div style={{width:'400px',height:"70px",lineHeight:"70px",display:"inline-block"}}>
                                    <span style={{fontSize:"22px",color:"#111111",maxWidth:"250px",display:"inline-block",
                                        whiteSpace: "nowrap",textOverflow: 'ellipsis',}}>
                                        {title}
                                        <PopoverSpan popData={des || "暂无描述"}
                                                     data={<Icon style={{fontSize:"16px",color:"#dddddd",marginLeft:"14px"}}
                                                                 type="exclamation-circle-o" />} />
                                        </span>
                                </div>
                        }
                    </div>
                    {
                        this.props.detailsType === "share" ? null : <Button style={{float:"right"}} onClick={()=>this.onReadEdit(editState)}>{
                            editState ? "保存" : "编辑"
                        }</Button>
                    }

                </div>
                {
                    <Filter handleSure={this.handleSure} handleReset={this.handleReset}>
                        <div style={{width:"480px"}}>
                            <div className ="data-area filter-part">
                                <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                    <label>地区:</label>
                                </div>
                                <div style={{display:"inline-block"}}>
                                    <AreaSelect ref="area" onChange={this.handleAreaChange} />
                                </div>
                            </div>
                            <div className="filter-part" style={{position:'relative',top:'0px'}}>
                                <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                    <label>时间:</label>
                                </div>
                                <Date
                                    style={{width:230,height:34}}
                                    time={[options.startDate, options.endDate]}
                                    change={this.handleChange}
                                />
                            </div>
                            <div className="filter-part">
                                {/*<div className="filter-part">*/}
                                    {/*<div style={{display:"inline-block",width:"70px",textAlign:"right"}}>*/}
                                        {/*<label>产品线:</label>*/}
                                    {/*</div>*/}
                                    {/*<div style={{display:"inline-block"}}>*/}
                                        {/*<Range ref="businessLines" listData={businessLinesData} onChange={this.handleBusinessLinesChange}/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                    <label>时间维度:</label>
                                </div>
                                <div style={{display:"inline-block"}}>
                                    <Range ref="range" onChange={this.handleRangeChange} />
                                </div>
                            </div>
                        </div>
                    </Filter>
                }
                <div className="line-bar">
                    <div style={{width:"100%"}}>
                        {
                            <ShowPartFactory data={echartsConfig} height={"100%"}/>
                        }
                        {
                            itemList && itemList.type === "table" ?
                                <span style={{position:"relative",top:"-45px"}}>
                                    <OutputSpan onClick={this.output}/>
                                </span>
                                : null
                        }
                    </div>
                </div>

                <MultiTable dateConfig={this.state.dateConfig}
                            visibility={(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number") ? "inherit" : "hidden"}
                            dataSource={this.getDataSource()}
                            total={this.state.total}
                            pageSize={this.state.pageSize}
                            columns={this.getColumns(columns,outputData)}
                            outputData={this.getDataSource(outputData,!(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number"))}
                            realOutputData={outputData}
                            onChange={this.onSearch}/>
            </div>
        )
    }
}
