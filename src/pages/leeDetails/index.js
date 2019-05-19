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
import { searchApi } from './api'

const rangeData = [
  [-15,0,1],
  [20,50,1],
  [0,20,1],
  [0,0.5,1],
  [0,0.5,1],
  [0,5,1],
  [210,270,1],
  [0,0.5,1],
]

const RangeMap = (min=0,max=100,length=0) => {
  return (min + (Math.random() * (max - min))).toFixed(length)
}

const getMomentDate = (key,day=7,type="halfAHour") => {
  //key代表数据类型 day代表随机生成数据天数 type代表数据步长
  const typeMap = {
    //timer代表数量与单位subtractLabel的倍数，transform代表单位和subtractLabel和天的倍数
    day:{
      subtractLabel:"day",
      formatLabel:"L",
      timer:1,
      transform:1,
    },
    halfAHour:{
      subtractLabel:"hours",
      formatLabel:"lll",
      timer:2,
      transform:24,
    }
  }
  const urlArr = window.location.href.split('/')
  const datas = {}
  const today = moment().format('L')

  //总量 和 计数
  let sum = 0
  let timer = 0

  const realDay = ( day*typeMap[type].timer * typeMap[type].transform )
  for(let i = 0;i<realDay;i++){
    const addData = RangeMap(...rangeData[key])
    const { subtractLabel, formatLabel, handle} = typeMap[type]
    datas[moment(moment().format('L')).subtract((realDay - i)/typeMap[type].timer,typeMap[type].subtractLabel).format(formatLabel)] = (Number(addData) + Number(sum)).toFixed(2)
    if(key === 3){
      sum += Number(addData)
      timer++
      if(timer % 48 === 1){
        sum = 0
      }
    }
  }
  if(key===3){
    console.log(datas)
  }
  return datas
}

const fixRainDayData = (data) => {

}

const data = [
  {
    "total": 9,
    "itemTitle": "大气温度变化趋势",
    "count": 9,
    "label": "时间,大气温度",
    "type": "lines",
    "itemDataList": [
      {
        "label": "大气温度",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 4.5,
          "2018-10-10 07:30:00": 3.6,
          "2018-10-10 08:00:00": 3.3,
          "2018-10-10 06:00:00": 4,
          "2018-10-10 07:00:00": 3.8,
          "2018-10-10 06:30:00": 3.9,
          "2018-10-10 05:30:00": 4.1,
          "2018-10-10 08:30:00": 3.1,
          "2018-10-10 05:00:00": 4.3
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "大气湿度变化趋势",
    "count": 9,
    "label": "时间,大气湿度",
    "type": "lines",
    "itemDataList": [
      {
        "label": "大气湿度",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 86.5,
          "2018-10-10 07:30:00": 91,
          "2018-10-10 08:00:00": 92.3,
          "2018-10-10 06:00:00": 91.2,
          "2018-10-10 07:00:00": 90.4,
          "2018-10-10 06:30:00": 89.2,
          "2018-10-10 05:30:00": 88.6,
          "2018-10-10 08:30:00": 91.7,
          "2018-10-10 05:00:00": 85.2
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "土壤湿度变化趋势",
    "count": 9,
    "label": "时间,土壤湿度",
    "type": "lines",
    "itemDataList": [
      {
        "label": "土壤湿度",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 37.4,
          "2018-10-10 07:30:00": 36.8,
          "2018-10-10 08:00:00": 37.2,
          "2018-10-10 06:00:00": 36.6,
          "2018-10-10 07:00:00": 36.6,
          "2018-10-10 06:30:00": 36.6,
          "2018-10-10 05:30:00": 37,
          "2018-10-10 08:30:00": 37.3,
          "2018-10-10 05:00:00": 37.1
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "土壤温度变化趋势",
    "count": 9,
    "label": "时间,土壤温度",
    "type": "lines",
    "itemDataList": [
      {
        "label": "土壤湿度",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 10.2,
          "2018-10-10 07:30:00": 10,
          "2018-10-10 08:00:00": 10,
          "2018-10-10 06:00:00": 10.2,
          "2018-10-10 07:00:00": 10.1,
          "2018-10-10 06:30:00": 10.1,
          "2018-10-10 05:30:00": 10.2,
          "2018-10-10 08:30:00": 10,
          "2018-10-10 05:00:00": 10.2
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "降雨量变化趋势",
    "count": 9,
    "label": "时间,降雨量",
    "type": "lines",
    "itemDataList": [
      {
        "label": "降雨量",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 0,
          "2018-10-10 07:30:00": 0,
          "2018-10-10 08:00:00": 0,
          "2018-10-10 06:00:00": 0,
          "2018-10-10 07:00:00": 0,
          "2018-10-10 06:30:00": 0,
          "2018-10-10 05:30:00": 0,
          "2018-10-10 08:30:00": 0,
          "2018-10-10 05:00:00": 0
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "日降雨量变化趋势",
    "count": 9,
    "label": "时间,日降雨量",
    "type": "lines",
    "itemDataList": [
      {
        "label": "日降雨量",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 0,
          "2018-10-10 07:30:00": 0,
          "2018-10-10 08:00:00": 0,
          "2018-10-10 06:00:00": 0,
          "2018-10-10 07:00:00": 0,
          "2018-10-10 06:30:00": 0,
          "2018-10-10 05:30:00": 0,
          "2018-10-10 08:30:00": 0,
          "2018-10-10 05:00:00": 0
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "风速变化趋势",
    "count": 9,
    "label": "时间,风速",
    "type": "lines",
    "itemDataList": [
      {
        "label": "风速",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 1,
          "2018-10-10 07:30:00": 2.2,
          "2018-10-10 08:00:00": 1.7,
          "2018-10-10 06:00:00": 1.5,
          "2018-10-10 07:00:00": 1.7,
          "2018-10-10 06:30:00": 2.5,
          "2018-10-10 05:30:00": 1.4,
          "2018-10-10 08:30:00": 2.1,
          "2018-10-10 05:00:00": 1.7
        }
      }
    ]
  },
  {
    "total": 9,
    "itemTitle": "风向变化趋势",
    "count": 9,
    "label": "时间,风向",
    "type": "lines",
    "itemDataList": [
      {
        "label": "风向",
        "total": 100,
        "datas": {
          "2018-10-10 04:30:00": 353,
          "2018-10-10 07:30:00": 306,
          "2018-10-10 08:00:00": 291,
          "2018-10-10 06:00:00": 327,
          "2018-10-10 07:00:00": 324,
          "2018-10-10 06:30:00": 309,
          "2018-10-10 05:30:00": 344,
          "2018-10-10 08:30:00": 296,
          "2018-10-10 05:00:00": 349
        }
      }
    ]
  }
]
  || [
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(0),"label":"大气温度","total":100}]
    ,"itemID":"1","itemTitle":"温度变化趋势","label":"日期,大气温度","total":7,"type":"lines"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(1),"label":"大气湿度","total":100}]
    ,"itemID":"1","itemTitle":"湿度变化趋势","label":"日期,大气湿度","total":7,"type":"lines"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(2),"label":"土湿度","total":100}]
    ,"itemID":"1","itemTitle":"土湿度变化趋势","label":"日期,土湿度","total":7,"type":"lines"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(3),"label":"日雨量","total":100}]
    ,"itemID":"1","itemTitle":"日雨量变化趋势","label":"日期,日雨量","total":7,"type":"bar"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(4),"label":"雨量","total":100}]
    ,"itemID":"1","itemTitle":"雨量变化趋势","label":"日期,雨量","total":7,"type":"bar"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(5),"label":"风速","total":100}]
    ,"itemID":"1","itemTitle":"风速变化趋势","label":"日期,风速","total":7,"type":"lines"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(6),"label":"风向","total":100}]
    ,"itemID":"1","itemTitle":"风向变化趋势","label":"日期,风向","total":7,"type":"bar"
  },
  {
    "count":7,
    "des":"",
    "itemDataList":[{"datas":getMomentDate(7),"label":"土温","total":100}]
    ,"itemID":"1","itemTitle":"土温变化趋势","label":"日期,土温","total":7,"type":"lines"
  },
]

const fixRes = (result) => {
  return {data:{"code":200,"msg":"成功","result":result,"success":true}}
}

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

  componentWillReceiveProps(nextProps){
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

  onSearch = async (config) => {//表格页码变化config
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
    let data = await searchApi({
      endDate: parse.endDate,
      startDate: parse.startDate,
    })
    this.getTableData(data)
    this.getChartsData(data)
  }

  //获取表格和图表的方法
  getTableData = (data) => {
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 1]
    const res = fixRes(data[id])
    this.setState({
      itemList:this.fixTableData(res.data.result),
      total:res.data.result.count,
      itemTitle:res.data.result.itemTitle,
      des:res.data.result.newDes,
      newName:res.data.result.itemTitle,
      newDes:res.data.result.newDes,
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

  getChartsData = (data) => {
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 1]
    const res = fixRes(data[id])
    this.setState({
      echartsConfig:{type:"loading"},
    })
    this.setState({
      echartsConfig:res.data.result,
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
    message.warning("所选项不支持下钻")
    // const urlArr = window.location.href.split('/')
    // const id = urlArr[urlArr.length - 1]
    // const contentID = urlArr[urlArr.length - 2]
    // const pageType = urlArr[urlArr.length - 3]
    //
    // const noDrillArray = [34,33,29,30]
    // if(noDrillArray.findIndex(i=> (~~i===~~id) ) !== -1){
    //   message.warning("所选项不支持下钻")
    //   return
    // }
    //
    // const { userStore:{isCloseRobot} } = this.props.rootStore;
    // const state = this.state
    // const addParse =  this.props.detailsType === "search" ? {searchItemID:id,contentID,} : {itemID: id}
    // const tableParse = {
    //   endDate: state.endDate,
    //   startDate: state.startDate,
    //   pageSize:state.pageSize,
    //   beginIndex:state.current,
    //   timeType:state.timeType,
    //   province:state.provincesId,
    //   city:state.cityId,
    //   district:state.districtId,
    //   businessLines:state.businessLines,
    //   ...addParse
    // }
    // tableParse.isCloseRobot = isCloseRobot
    // const filterParse = {
    //   boardID:contentID,
    //   itemID:id,
    //   ...tableParse
    // }
    // console.log(key,label,filterParse)
    // //qs.stringify
    // const parse = ({
    //   itemForm: {
    //     ...filterParse
    //   },
    //   paramX: key,
    //   paramY: label,
    // })
    // const getData = () => {
    //
    // }
    //
    // const title = this.context.router.route.location.state ? this.context.router.route.location.state.title :
    //   (this.state.itemTitle || "")
    // let BreadcrumbOption = [
    //   {
    //     name:title,
    //     jumpUrl:`/${+pageType}/${this.context.router.route.match.params.id}`,
    //   }
    // ]
    // if(this.context.router.route.location.state && this.context.router.route.location.state.id){
    //   BreadcrumbOption = [
    //     {
    //       name:this.context.router.route.location.state.outterTitle,
    //       jumpUrl:`/${pageType === "shareDetails" ? "share" : "data"}/${this.context.router.route.location.state.id}`,
    //     },
    //     {
    //       name:title,
    //       jumpUrl:`/${+pageType}/${this.context.router.route.match.params.id}`,
    //     },
    //     {
    //       name:"数据下钻",
    //       jumpUrl:`/${pageType === "shareDetails" ? "shareDrillDown" : "drillDown"}/${id}`,
    //     },
    //   ]
    // }
    // this.jump(`/${pageType === "shareDetails" ? "shareDrillDown" : "drillDown"}/${contentID}/${id}`,{BreadcrumbOption:BreadcrumbOption,parse:parse})
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
                    withTotal={false}
                    visibility={(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number") ? "inherit" : "hidden"}
                    dataSource={this.getDataSource()}
                    total={this.state.total}
                    pageSize={this.state.pageSize}
                    columns={this.getColumns(columns,outputData)}
                    outputData={this.getDataSource(outputData,!(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number"))}
                    realOutputData={outputData}
                    onChange={this.onSearch}/>

        <Upload
            name= 'file'
            action='http://47.100.61.144:9000/upload/excel'
            headers={
                {
                    authorization: 'authorization-text'
                }
            }
            onChange ={(info) => {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            }
            }
            data={{
              name:"气象数据",
              code:"001",
            }}
        >
          <Button>
            <Icon type="upload" /> Click to Upload
          </Button>
        </Upload>
      </div>
    )
  }
}
