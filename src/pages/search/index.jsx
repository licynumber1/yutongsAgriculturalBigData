import  React,{Component} from 'react'
import Date from '../../components/datePicker'
import { Select, Button } from 'antd'
import {ContentData} from './contentData'
import qs from 'qs'
import RenderDimensionalArray from '../../shared/renderDimensionalArray'
import GetDataConfigWrapper from '../../shared/getDataConfigWrapper'
import Range from '../../components/range'
import './index.less'
import {message} from "antd/lib/index";
import axios from "../../common/request";
import moment from "moment/moment";
import {inject, observer} from "mobx-react/index";
import Filter from "../../components/Filter"
import { listData,businessLinesData } from "../../constant"
import PropTypes from "prop-types";
import { colorLabelMap } from '../../utils/utils'

@inject('rootStore')
@observer
export default class extends Component{
  constructor(props){
    super(props);
    this.state ={
        startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate:moment().format('YYYY-MM-DD'),
        itemList:[],
        timeType:listData[0].value,
        isCollected:undefined,
        businessLines:businessLinesData[0].value,
        options:{
            startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
            endDate:moment().format('YYYY-MM-DD'),
        },
    }
  }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    getFormData = () => {
        const { startDate,endDate,timeType,businessLines } = this.state
        const data = {
            startDate,
            endDate,
            timeType,
            businessLines,
        }
        return data
    }

  handleChange = ([startDate, endDate])=>{
        this.setState({
            startDate:startDate.format('YYYY-MM-DD'),
            endDate:endDate.format('YYYY-MM-DD'),
        })
  }

  componentDidMount() {
      this.getNewSearchInfo()
    }

    componentWillReceiveProps(nextProps) {
        this.getNewSearchInfo()
    }

    onSelect = (e) => {
        this.changeStateAndSearch({
            timeType:e
        })
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
        })
    }

    handleReset = () => {
        this.refs.range.reset()
        //this.refs.businessLines.reset()

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
        })
    }

    changeStateAndSearch = (data) => {
        this.setState(data)
    }

    getNewSearchInfo = () => {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 2]
        const label = urlArr[urlArr.length - 1]
        const parse = qs.stringify({contentID:id,label:label},{ encode: false })
        axios.getWithoutCancel(`fs/base/data/search/searchItems?${parse}`,{} ).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.saveItemList(res.data.result || [])
            }else{
                message.error( (res && res.data && res.data.msg) || '获取搜索项失败');
            }
        })
    }

    saveItemList = (data) => {
      const {label,title,searchItemIDList,isCollected} = data
      this.setState({
          itemList:searchItemIDList,
          label,
          title,
          isCollected,
      })
    }

    getCollection = () => {
      console.log(2)
        const { menuStore:{changeCollection},userStore:{userId} } = this.props.rootStore;
        axios.postJSONWithoutCancel(`/fs/base/data/collection/getList`, {}).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                changeCollection(res.data.result)
            }else if(userId){
                message.error( (res && res.data && res.data.msg) || '获取收藏栏失败');
            }
        })
    }

    collection = (label) => {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 2]
        const url = this.state.isCollected === 0 ? "save" : "cancel"
        const parse = qs.stringify({
            title:this.state.title,
            label,
            contentID:id
        })
        axios.postJSONWithoutCancel(`/fs/base/data/collection/${url}?${parse}`).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.getCollection()
                setTimeout(()=>this.jump('/renderSelf',{backUrl:this.context.router.route.location.pathname}),0)
            }else{
                message.error( (res && res.data && res.data.msg) || '获取收藏栏失败');
            }
        })
    }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }

    getPartNum(label){
        let splice = [0,3,4]
        if(label === "内容" || label === "频道"){
            splice = [0,3,4]
        }
        return splice
    }

  render(){
    const {startDate, endDate, title, label,isCollected,options} = this.state;
    const partNum = this.getPartNum(label)
    const headerData = (this.state.itemList).slice(partNum[0],partNum[1]) || []
    const mainData = (this.state.itemList).slice(partNum[1],partNum[2]) || []
    const endData  =(this.state.itemList).slice(partNum[2]) || []
    const pageType = 'search'
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 2]
    return <div className="search-container">
      <div className="content">
        <div className="content-header">
          <h2>{title}
            <span style={{backgroundColor:colorLabelMap[label] || "#000000"}}>
                { label }
            </span>
          </h2>
          <div>
              <Button onClick={()=>this.collection(label)}>
                  {
                      isCollected === undefined ? "暂无字段" :
                          (isCollected === 1) ? "取消收藏" : "收藏"
                  }
              </Button>
              {/*isCollected*/}
              <Filter handleSure={this.handleSure} handleReset={this.handleReset}>
                  <div style={{width:"480px"}}>
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
                      {/*<div className="filter-part">*/}
                          {/*<div style={{display:"inline-block",width:"70px",textAlign:"right"}}>*/}
                              {/*<label>产品线:</label>*/}
                          {/*</div>*/}
                          {/*<div style={{display:"inline-block"}}>*/}
                              {/*<Range ref="businessLines" listData={businessLinesData} onChange={this.handleBusinessLinesChange}/>*/}
                          {/*</div>*/}
                      {/*</div>*/}
                      <div className="filter-part">
                          <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                              <label>时间维度:</label>
                          </div>
                          <div style={{display:"inline-block"}}>
                              <Range ref="range" onChange={this.handleRangeChange}/>
                          </div>
                      </div>
                  </div>
              </Filter>
          </div>
        </div>
        <ContentData data={headerData} searchData={this.getFormData()} pageType={pageType} id={id}/>
          <div className="line-bar">
              <div style={{width:"100%"}}>
                  <div className="search-data-list">
                      {
                          mainData[0] ?
                              <GetDataConfigWrapper className='search-main-charts'
                                                    withoutTitle
                                                    chartsId={mainData[0]}
                                                    searchData={this.getFormData()}
                                                    pageType={pageType}
                                                    id={id}
                              /> : null
                      }
                  </div>
              </div>
          </div>
          <div>
              <RenderDimensionalArray data={endData} getFormData={this.getFormData} pageType={pageType} id={id}/>
          </div>
      </div>
    </div>
  }
}