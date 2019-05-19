import React,{Component} from 'react'
import './index.less'
import { Input, Button, Popconfirm, Icon } from 'antd'
import Date from '../../components/datePicker'
import AreaSelect from '../../components/AreaSelect'
import Range from '../../components/range'
// import Email from './email'
import {observer,inject} from 'mobx-react'
import Share from'./share'
import {message} from "antd/lib/index";
import axios from "../../common/request";
import moment from 'moment'
import RenderDimensionalArray from '../../shared/renderDragactArray'
import qs from 'qs';
import PropTypes from "prop-types";
import { requireValidator,lengthValidator } from '../../shared/validator/index'
import Filter from "../../components/Filter"
import Breadcrumb from "../../components/Breadcrumb"
import { listData,businessLinesData } from "../../constant"

const initState = {
    startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate:moment().format('YYYY-MM-DD'),
    id:undefined,
    itemList:[],
    errMsg:undefined,
    provincesId:undefined,
    cityId:undefined,
    districtId:undefined,
    timeType:listData[0].value,
    businessLines:businessLinesData[0].value,
    height:800,
    options:{
        startDate:moment().subtract(7, 'days').format('YYYY-MM-DD'),
        endDate:moment().format('YYYY-MM-DD'),
    },
}

@inject('rootStore')
@observer
class Data extends Component{
  constructor(props){
    super(props)
    this.state ={
        ...initState
    }
  }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };
    componentDidMount() {
        window.onkeyup = (e) => {
            if(e.keyCode === 27){
                this.fullScreen(false)
            }
        }

        this.listenFull(this.setFullState)

        this.setState({
            height:document.documentElement.clientHeight - 60
        })

        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const menuIdArr = this.props.rootStore.menuStore.menu.slice().map(i=>i.id)
        if(!menuIdArr.some(i=>i===id)){//当位于menu存在,并且id不存在于menu的情况下,跳转到正确的主页去
            if(menuIdArr.length){
                this.jump('/')
            }else if(this.props.pageType === "share") {//分页页面没有menu,因此需获取
                this.getBoardById()
            }
        }else{
            if(id){
                this.setState({
                    ...initState,
                    id:id,
                    oldName:this.getPartName(this.props.rootStore.menuStore.menu.slice()),
                    newName:this.getPartName(this.props.rootStore.menuStore.menu.slice()),
                })
                this.getBoardById()
            }
        }
    }

    changeState = (itemList) => {
        this.setState({
            itemList,
        })
    }

    listenFull = (cb)=> {
        document.addEventListener("fullscreenchange", (e)=>{
            cb(e)
        });
        document.addEventListener("mozfullscreenchange", (e)=>{
            cb(e)
        });
        document.addEventListener("webkitfullscreenchange", (e)=>{
            cb(e)
        });
        document.addEventListener("msfullscreenchange", (e)=>{
            cb(e)
        });
    }

    setFullState = () => {
        this.setState({
            mobileFull:this.isFull()
        })
    }

    isFull = () => {
        var fullscreenElement =
            document.fullscreenEnabled
            || document.mozFullscreenElement
            || document.webkitFullscreenElement;
        var fullscreenEnabled =
            document.fullscreenEnabled
            || document.mozFullscreenEnabled
            || document.webkitFullscreenEnabled;
        if (fullscreenElement == null)
        {
            return false;
        } else {
            return true;
        }
    }

    componentWillReceiveProps(nextProps) {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        nextProps.rootStore.uiStore.changeShowModal('clearUI');
        const menuIdArr = nextProps.rootStore.menuStore.menu.slice().map(i=>i.id)
        if(!menuIdArr.some(i=>i===id)){//当位于menu存在,并且id不存在于menu的情况下,跳转到正确的主页去
            if(menuIdArr.length){
                this.jump('/')
            }
        }else{
            if(id !== this.state.id){
                this.setState({
                    ...initState,
                    id:id,
                    oldName:this.getPartName(nextProps.rootStore.menuStore.menu.slice()),
                    newName:this.getPartName(nextProps.rootStore.menuStore.menu.slice()),
                })
                this.getBoardById()
            }
        }
    }

    jump = (url) => {
        this.context.router.history.push(url)
    }

    getBoardById = () => {
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        let url
        let parse = {}
        const { pageType } = this.props
        switch(pageType){
            case 'data':
                url = `fs/base/data/board/${id}`;
                break
            case 'share':
                url = `fs/base/data/share/${id}`;
                parse = {}
                break
            default:
                url = ''
        }
        axios.getWithoutCancel(url, parse).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                this.setState({
                    boardName:res.data.result.boardName,
                    itemList:res.data.result.itemList || res.data.result.itemIDList || res.data.result || []
                })
            }else if(res && res.data && res.data.code === 403 && res.data.msg){
                this.setState({
                    errMsg:res.data.msg
                })
            }
            else{
                message.error( (res && res.data && res.data.msg) || '获取版面失败');
            }
        })
    }

    getMenu() {
        // const { menuStore:{changeMenu} } = this.props.rootStore;
        // axios.getWithoutCancel(`fs/base/data/board/get/menu`, {}).then(res=>{
        //     if(res && res.data && res.data.code === 200 && res.data.result){
        //         changeMenu(res.data.result)
        //     }else{
        //         message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
        //     }
        // })
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
      })
  }

  handleTitleChange = (e) => {
      this.setState({
          newName: e.target.value
      })
  }
  handleShowModal = (key)=>{
    this.props.rootStore.uiStore.changeShowModal(key);
  }

    componentWillUnmount(){
        this.props.rootStore.uiStore.clearShowModal("editorModal");
        window.onkeyup = () => {}
    }
  saveName = () => {
      const urlArr = window.location.href.split('/')
      const boardID = urlArr[urlArr.length - 1]
      const boardName = this.state.newName
      const parse = qs.stringify({boardID,boardName})
      if(requireValidator({value:boardName},'指标名称不能为空')
          && lengthValidator({value:boardName},'指标名称最多10个字')
      ){
          if(this.state.oldName !== this.state.newName){
              axios.postJSONWithoutCancel(`fs/base/data/board/update?${parse}`,{}).then(res=>{
                  if(res && res.data && res.data.code === 200 && res.data.result){
                      this.getMenu()
                  }else{
                      message.error( (res && res.data && res.data.msg) || '保存标题失败');
                  }
              })
          }
      }
  }
  getPartName = (menuArr) => {
      const urlArr = window.location.href.split('/')
      const id = urlArr[urlArr.length - 1]
      return menuArr.filter(i=>{return i.id === id})[0] ? menuArr.filter(i=>{return i.id === id})[0].board_name : ""
  }

  onShare = () => {
      return this.getFormData
  }
  getFormData = () => {
      const { startDate,endDate,provincesId,cityId,districtId,timeType,businessLines} = this.state
      const data = {
          startDate:startDate,
          endDate:endDate,
          province:provincesId,
          city:cityId,
          district:districtId,
          businessLines:businessLines,
          timeType,
      }
      return data
  }

  onConfirm = () => {
    this.onDelete()
  }

  onDelete = () => {
      const parse = {
          boardID:this.getId()
      }
      axios.del(`fs/base/data/board/delete`, parse).then(res=>{
          if(res && res.data && res.data.code === 200){
              message.success('删除版面成功')
              this.context.router.history.push('')
          }else{
              message.error( (res && res.data && res.data.msg) || '删除版面失败');
          }
      })
  }
  getId = () => {
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 1]
    return id
    }

    //移动端适配代码

    getPerData = () => {
        if(this.mobileAndShareTag()){
            return 1
        }
        return 3
    }

    mobileAndShareTag = () => {
        return (this.props.pageType === "share" && this.isMobile())
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

    mobileFullScreen = () => {//手机全屏
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        };
        return;
    }

    mobileExitScreen = () => {//手机退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    fullScreen = (val) => {
        this.setState({
            noFirstIn:true
        },()=>{
            if(this.isMobile()){//浏览器全屏
                this.isInFullscreen() ? this.mobileFullScreen() : this.mobileExitScreen()
            }else{
                const {uiStore: {changeWidthTag}} = this.props.rootStore;
                this.setState({
                    full:val!==undefined ? val : !this.state.full
                }, changeWidthTag)
            }
        })
    }

    isInFullscreen = () => {
        return !this.state.mobileFull
    }

    render(){
    const { pageType } = this.props
    const isDataPage = pageType === "data"
    const {startDate,endDate,options} =this.state;
    const {editorModal,shareModal} = this.props.rootStore.uiStore.modalList;
    const editType = this.props.rootStore.uiStore.modalList.editorModal
    const menuArr = this.props.rootStore.menuStore.menu.slice()
    const id = this.getId()
    const BreadcrumbOption = [
        {
            name:this.getPartName(menuArr),
            jumpUrl:"/data/"+this.context.router.route.match.params.id,
        }
    ]
    return <div className="data-container" style={this.isMobile() ? {margin:"0px -20px",width:"initial"} : {}}>
        <Breadcrumb BreadcrumbOption={BreadcrumbOption}></Breadcrumb>
        {
            pageType === "share" ?
                (!this.state.errMsg ?
                        <div className="header-wrapper">
                            <div style={{width:'250px',position:"relative",height:"70px",lineHeight:"70px"}}>
                                    <span style={{fontSize:"22px",color:"#111111",maxWidth:"250px",display:"inline-block",
                                        whiteSpace: "nowrap",overflow:"hidden",textOverflow: 'ellipsis',}}>
                                        {this.state.boardName}
                                    </span>
                            </div>
                            <div className="data-header">
                                <Filter handleSure={this.handleSure} handleReset={this.handleReset}>
                                    <div style={this.mobileAndShareTag() ? {width:"250px"} : {width:"480px"}}>
                                        <div className ="data-area filter-part">
                                            <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                                <label>地区:</label>
                                            </div>
                                            <div style={{display:"inline-block"}}>
                                                <AreaSelect ref="area" isMini={this.mobileAndShareTag()} onChange={this.handleAreaChange} />
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
                                                isMobile={this.mobileAndShareTag()}
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
                                                <Range ref="range" onChange={this.handleRangeChange} />
                                            </div>
                                        </div>
                                    </div>
                                </Filter>
                                <div className="item-icon">
                                    <span>
                                         <Icon style={{fontSize: "18px",lineHeight:"36px", margin: "0 4px", padding: "0 2px", cursor: "pointer"}}
                                               type={!this.isInFullscreen() ? "shrink" : "arrows-alt"} onClick={()=>this.fullScreen()}/>
                                     </span>
                                </div>
                                {
                                    isDataPage ?
                                        <div className="item-icon">
                                            <span className ={editorModal ? 'editorModal' : ''}>
                                                <i className="iconfont b_icon icon-bianji"  onClick ={this.handleShowModal.bind(null,'editorModal')}></i>
                                            </span>
                                            <span className ={shareModal ? 'shareModal' : ''}>
                                                <i className=" iconfont b_icon icon-fenxiang"  onClick ={this.handleShowModal.bind(null,'shareModal')}></i>
                                                <Share id={id} onShare={this.onShare}/>
                                            </span>
                                            <span>
                                               <Icon style={{fontSize: "18px",lineHeight:"36px", margin: "0 4px", padding: "0 2px", cursor: "pointer"}}
                                                     type="arrows-alt" onClick={()=>this.fullScreen()}/>
                                             </span>
                                        </div> : null
                                }
                            </div>
                        </div>
                 :
                    <div style={{textAlign:"center",height:this.state.height+"px",
                                 lineHeight:this.state.height+"px",fontSize:"20px"}}>
                        <span style={{lineHeight:"40px",display:"inline-block"}}>{this.state.errMsg}</span>
                        </div>)
                    :
                        <div className="header-wrapper">
                            <div className="data-title">
                            {
                                editType ?
                                    <div style={{width:'400px',height:"70px",lineHeight:"70px"}}>
                        <span style={{display:'inline-block',width:'120px'}}>
                            <Input
                                onChange={this.handleTitleChange}
                                defaultValue={this.getPartName(menuArr)}
                                onBlur={this.saveName}
                                onPressEnter={this.saveName}
                            />
                        </span>
                                        {/*<Popconfirm title={`确认删除看板"${this.state.oldName}"？`} okText="确认" cancelText="取消" onConfirm={this.onConfirm}>*/}
                                            {/*<Button style={{marginLeft:"10px"}} type="danger">删除</Button>*/}
                                        {/*</Popconfirm>*/}
                                    </div> :
                                    <div style={{width:'250px',position:"relative",height:"70px",lineHeight:"70px"}}>
                                <span style={{fontSize:"22px",color:"#111111",maxWidth:"250px",display:"inline-block",whiteSpace: "nowrap",overflow:"hidden",textOverflow: 'ellipsis',}}>
                                    {this.getPartName(menuArr)}</span>
                                    </div>
                            }
                        </div>
                                <div className="data-header">
                                    <Filter handleSure={this.handleSure} handleReset={this.handleReset}>
                                        <div style={this.mobileAndShareTag() ? {width:"250px"} : {width:"480px"}}>
                                            <div className ="data-area filter-part">
                                                <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                                    <label>地区:</label>
                                                </div>
                                                <div style={{display:"inline-block"}}>
                                                    <AreaSelect ref="area" isMini={this.mobileAndShareTag()} onChange={this.handleAreaChange} />
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
                                                    isMobile={this.mobileAndShareTag()}
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
                                            <div  className="filter-part">
                                                <div style={{display:"inline-block",width:"70px",textAlign:"right"}}>
                                                    <label>时间维度:</label>
                                                </div>
                                                <div style={{display:"inline-block"}}>
                                                    <Range ref="range" onChange={this.handleRangeChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </Filter>
                                    {
                                        isDataPage ?
                                            <div className="item-icon">
                                                <span className ={editorModal ? 'editorModal' : ''}>
                                                   <i className="iconfont b_icon icon-bianji"  onClick ={this.handleShowModal.bind(null,'editorModal')}></i>
                                                 </span>
                                                <span className ={shareModal ? 'shareModal' : ''}>
                                                   <i className=" iconfont b_icon icon-fenxiang"  onClick ={this.handleShowModal.bind(null,'shareModal')}></i>
                                                   <Share id={id} onShare={this.onShare}/>
                                                 </span>
                                                <span>
                                                   <Icon style={{fontSize: "18px",lineHeight:"36px", margin: "0 4px", padding: "0 2px", cursor: "pointer"}}
                                                         type="arrows-alt" onClick={()=>this.fullScreen()}/>
                                                 </span>
                                            </div> : null
                                    }
                                </div>
                        </div>

        }

        <div>
            <RenderDimensionalArray data={this.state.itemList}
                                    changeState={this.changeState}
                                    perData={this.getPerData()}
                                    getFormData={this.getFormData}
                                    editorModal={editorModal}
                                    getBoardById={this.getBoardById}
                                    pageType={pageType}
                                    outterTitle={this.getPartName(menuArr)}
            />

            {
                this.state.full ?
                    <div style={{position: "fixed", overflow: "auto", top: "0", right: "0", bottom: "0", left: "0",
                        zIndex: "1000",outline: "0",background:"#cccccc"}}>
                        <div style={{position:"relative",margin:"0px 20px"}}>
                            <div className="data-title">
                                {
                                    editType ?
                                        <div style={{width:'400px',height:"70px",lineHeight:"70px"}}>
                        <span style={{display:'inline-block',width:'120px'}}>
                            <Input
                                onChange={this.handleTitleChange}
                                defaultValue={this.getPartName(menuArr)}
                                onBlur={this.saveName}
                                onPressEnter={this.saveName}
                            />
                        </span>
                                            {/*<Popconfirm title={`确认删除看板"${this.state.oldName}"？`} okText="确认" cancelText="取消" onConfirm={this.onConfirm}>*/}
                                            {/*<Button style={{marginLeft:"10px"}} type="danger">删除</Button>*/}
                                            {/*</Popconfirm>*/}
                                        </div> :
                                        <div style={{width:'250px',position:"relative",height:"70px",lineHeight:"70px"}}>
                                <span style={{fontSize:"22px",color:"#111111",maxWidth:"250px",display:"inline-block",whiteSpace: "nowrap",overflow:"hidden",textOverflow: 'ellipsis',}}>
                                     {this.state.boardName}</span>
                                        </div>
                                }
                            </div>
                            <RenderDimensionalArray data={this.state.itemList}
                                                    changeState={this.changeState}
                                                    perData={this.getPerData()}
                                                    getFormData={this.getFormData}
                                                    editorModal={editorModal}
                                                    getBoardById={this.getBoardById}
                                                    pageType={pageType}
                                                    full={true}
                                                    outterTitle={this.getPartName(menuArr)}
                            />
                            <div style={{position:"absolute",right:"0px",top:"15px",textAlign:"right",zIndex:9999}}>
                                <Icon style={{cursor:"pointer"}} type="shrink" onClick={()=>this.fullScreen()}/>
                                <br/>
                                <span>按ESC键退出全屏模式</span>
                            </div>
                        </div>
                    </div> : null
            }

        </div>

    </div>
  }
}


export default Data