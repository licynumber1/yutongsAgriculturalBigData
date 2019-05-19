import React,{Component} from 'react';
import RSelect from './select'
import Date from '../../components/datePicker'
import './index.less'
import moment from "moment/moment";
import {message} from "antd/lib/index";
import axios from "../../common/request";
import ShowPartFactory from '../../shared/showPartFactory'
import MultiTable from '../../shared/MultiTable/index'
import {inject, observer} from "mobx-react/index";
import PropTypes from 'prop-types';
import NoRepeatButton from '../../shared/project/noRepeatButton'
import { Input } from 'antd'
import Breadcrumb from "../../components/Breadcrumb"

const label = {
  add:"保存",
  name:undefined,
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
    super(props)
    this.state ={
        startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate:moment().format('YYYY-MM-DD'),
        echartsConfig:{},
        itemID:undefined,
        total:0,
        pageSize:'20',
        current:1,
        itemList:undefined,
        name:undefined,
    }

  }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

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

  onAdd = () => {
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 1]
    const {itemID,name,des} = this.state
    const parse = {
        boardID:id,
        itemID,
        name,
        des,
    }
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
        axios.put(`fs/base/data/item/save`, parse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                message.success('新增指标成功')
                this.jump(`/data/${id}`)
            }else{
                message.error((res && res.data && res.data.msg) || '新增指标失败');
            }
        })
    }else{
        const str = (nameValidator ? "" : "名称长度过长") + (descriptValidator ? "" : "描述长度过长")
        message.error(str)
    }
  }

  jump = (url) => {
      this.context.router.history.push(url)
  }

    //选择指标时回调函数用于查询数据
    fetchData = (id,config={}) => {
        const urlArr = window.location.href.split('/')
        const boardID = urlArr[urlArr.length - 1]
        const { pageSize,current,startDate,endDate } = this.state
        const initConfig = {
            pageSize,
            current,
            startDate,
            endDate,
        }
        const parse = Object.assign({},initConfig,config,{id})

        this.setState({
            itemID:id
        })

        const tableParse = {
            boardID,
            endDate: parse.endDate,
            itemID: id,
            startDate: parse.startDate,
            pageSize:parse.pageSize,
            beginIndex:parse.current,
        }

        const chartsParse = {
            boardID,
            endDate: parse.endDate,
            itemID: id,
            startDate: parse.startDate,
        }

        this.getTableData(tableParse)
        this.getChartsData(chartsParse)
    }

    //搜索，config为表格页码变化时才有的参数
    onSearch = (config) => {
        const id = this.state.itemID
        const { pageSize,current,startDate,endDate } = this.state
        const initConfig = {
            pageSize,
            current,
            startDate,
            endDate,
        }
        const parse = Object.assign({},initConfig,config,{id})

        const tableParse = {
            endDate: parse.endDate,
            itemID: id,
            startDate: parse.startDate,
            pageSize:parse.pageSize,
            beginIndex:parse.current,
        }

        const chartsParse = {
            endDate: parse.endDate,
            itemID: id,
            startDate: parse.startDate,
        }

        this.getTableData(tableParse)
        this.getChartsData(chartsParse)
    }

    //获取表格和图表的方法
    getTableData = (tableParse) => {
        const { userStore:{isCloseRobot} } = this.props.rootStore;
        tableParse.isCloseRobot = isCloseRobot
        axios.postJSONWithoutCancel(`fs/base/data/item/info`, tableParse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.setState({
                    itemList:this.fixTableData(res.data.result),
                    total:res.data.result.count || 0
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
        const { userStore:{isCloseRobot} } = this.props.rootStore;
        chartsParse.isCloseRobot = isCloseRobot
        this.setState({
            echartsConfig:{type:"loading"},
        })
        axios.postJSONWithoutCancel(`fs/base/data/item/info`, chartsParse).then(res=>{
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
    //将获取到的表格数据，转换成表格DataSource的形式
    getDataSource = (data,flag) => {
        if(flag){
            return []
        }
        let outputData = []
        const forEachData = data ? data : (this.state.itemList ? ( this.state.itemList.itemDataList || [] ): [])

        if(this.state.itemList && this.state.itemList.type === "pie"){
            const data = forEachData.map(i=>{
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

    handleNameChange = (e) => {
        this.setState({
            name:e.target.value
        })
    }

    handleDescriptChange = (e) => {
        this.setState({
            des:e.target.value
        })
    }

  render(){
      const {startDate,endDate, echartsConfig,itemList} = this.state;
      const outputData = (echartsConfig && echartsConfig.itemDataList) ? this.fixTableData(echartsConfig).itemDataList : []
      let BreadcrumbOption = [
          {
              name:"新增报表",
              jumpUrl:"/details/"+this.context.router.route.match.params.id,
          }
      ]
      if(this.context.router.route.location.state && this.context.router.route.location.state.id){
          BreadcrumbOption = [
              {
                  name:this.context.router.route.location.state.outterTitle,
                  jumpUrl:"/data/"+this.context.router.route.match.params.id,
              },
              {
                  name:"新增报表",
                  jumpUrl:"/culturalScreen/phone",
              }
          ]
      }
      return (<div className="add-container">
                <div className="add-content">
                    <Breadcrumb BreadcrumbOption={BreadcrumbOption}></Breadcrumb>
                    <h2>
                        新增报表
                        <NoRepeatButton type='primary' className="add-button" onClick={this.onAdd}>{label.add}</NoRepeatButton>
                    </h2>
                    <div className="add-list-item">
                      <label htmlFor="">报表名称</label>
                      <Input placeholder="不输入则为报表默认名称" onChange={this.handleNameChange}/>
                    </div>
                    <div className="add-list-item">
                        <label htmlFor="">备注信息</label>
                        <Input.TextArea autosize={{ minRows: 2, maxRows: 2 }}
                                        style={{width:"260px"}}
                                        placeholder="不输入则为报表默认名称"
                                        onChange={this.handleDescriptChange}/>
                    </div>
                    <div className="add-list-item">
                      <label htmlFor="">指标添加</label>
                      <RSelect
                        placeholder="请选择数据指标"
                        onClick={this.fetchData}
                        style={{width:'260px',height:'36px'}}
                      />
                    </div>
                    <div>
                        <div className="add-list-item">
                            <label htmlFor="">选择时间</label>
                            <Date
                                style={{width:230,height:34}}
                                time={[startDate, endDate]}
                                change={this.handleChange}
                            />
                        </div>
                        {
                            this.state.itemID ?
                                <div>
                                    <ShowPartFactory data={echartsConfig} height="100%"/>
                                    <div style={{width:"100%",height:"40px"}}></div>
                                    <MultiTable dateConfig={this.state.dateConfig}
                                                visibility={(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number") ? "inherit" : "hidden"}
                                                dataSource={this.getDataSource()}
                                                total={this.state.total}
                                                pageSize={this.state.pageSize}
                                                columns={this.getColumns(columns,outputData)}
                                                outputData={this.getDataSource(outputData,!(echartsConfig && echartsConfig.type !== "loading" && itemList && itemList.type !== "table" && itemList.type !== "number"))}
                                                onChange={this.onSearch}
                                                realOutputData={outputData}
                                    />
                                </div> :
                                null
                        }
                    </div>
              </div>
               </div>)
  }
}