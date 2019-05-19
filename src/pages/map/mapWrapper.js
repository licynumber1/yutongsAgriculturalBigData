import  React,{Component } from 'react'
import './index.less'
import {inject, observer} from "mobx-react/index";
import ShowPartFactory from '../../shared/showPartFactory'
import axios from "../../common/request";
import {message} from "antd/lib/index";
import { Popover,Icon,Modal } from 'antd'
import HiddenTable from "../../shared/project/HiddenTable"
import ServerTime from "../../shared/project/ServerTime"
import { websocketUrl } from '../../common/request'
const columns = [
    {
        title: '访问时间',
        dataIndex: 'visitTime',
        key: 'visitTime',
        width: '20%',
        className: 'column-center',
    },
    {
        title: '访问人',
        dataIndex: 'userName',
        key: 'userName',
        width: '20%',
        className: 'column-center',
    },
    {
        title: '访问位置',
        dataIndex: 'localtion',
        key: 'localtion',
        width: '20%',
        className: 'column-center',
    },
    {
        title: '访问内容',
        dataIndex: 'content_title',
        key: 'content_title',
        width: '20%',
        className: 'column-center',
    },
    {
        title: '内容类型',
        dataIndex: 'content_type',
        key: 'content_type',
        width: '20%',
        className: 'column-center',
    },
]
const iconStyle = {cursor:"pointer",color:"#ccc",marginRight:"20px"}
const iconAddStyle = {...iconStyle,fontSize:"24px"}
const height = 700
@inject('rootStore')
@observer

export default class extends Component{
    constructor(props){
        super(props);
        this.state ={
            modalVisible:false,
            newBoardName:"",
            loading:false,
            echartsConfig:{},
            full:false,
            parse:{},
            pageSize:10,
            step:10,
            dataSource:[],
            currentDate:undefined,
        }
        this.socketConnect()

    }

    socketConnect = () => {
        if (typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        } else {
            this.socket = new WebSocket(websocketUrl);
            //打开事件
            this.socket.onopen = () => {
                this.getSocket()
            };
            //获得消息事件
            this.socket.onmessage = (msg) => {
                if(typeof msg.data === "string" && msg.data.startsWith("ping")){
                    //console.log(msg.data)
                    //webSocket心跳
                  this.socket.send(msg.data);
                }else {
                    const fullData = JSON.parse(msg.data)
                    var data = fullData.msg !== "数据传输" ? {} :fullData.result
                    const { visitHistoryVos, visitMapVos, currentNum, maxNum, currentDate } = data
                    this.fixBlink(data)
                    this.setState({
                        pageSize:visitHistoryVos && visitHistoryVos.length || 10,
                        currentDate,
                        echartsConfig:{
                            type:"userMap",
                            itemDataList:visitMapVos,
                            title:{
                                currentNum, maxNum
                            }
                        },
                        dataSource:visitHistoryVos || [],
                    })
                }
            };
            //关闭事件
            this.socket.onclose = () => {
                //this.socketConnect()
            };
            //发生了错误事件
            this.socket.onerror = () => {
                alert("Socket发生了错误");
            }
        }
        return
    }

    fixBlink = (data) => {
        const { visitMapVos, currentNum, maxNum } = data
        const fix = (visitMapVos || []).filter(i=>{
            return i.isBlink === true
        })
        if(visitMapVos && fix.length){
            this.timeout = setTimeout(()=>{
                console.log(visitMapVos,fix,'闪烁数据')
                fix.forEach(i=>{
                    visitMapVos.forEach(j=>{
                        if(i.logID === j.logID){
                            j.isBlink = false
                        }
                    })
                })
                const newItemDataList = visitMapVos
                console.log(newItemDataList,'将数据修复为',fix)
                this.setState({
                    echartsConfig:{
                        type:"userMap",
                        itemDataList:newItemDataList,
                        title:{
                            currentNum, maxNum
                        }
                    },
                })
            },5000)
        }
    }

    getAddSocket = () => {
        this.getSocket(this.state.step)
    }

    getSocket = (num=0) => {
        const { userStore:{isCloseRobot} } = this.props.rootStore
        const pageSize = this.state.pageSize + num;
        const parse = {
            isCloseRobot,
            pageSize,
        }
        this.socket.send(JSON.stringify(parse));
        this.setState({
            pageSize
        })
    }

    componentDidMount(){
        window.onkeyup = (e) => {
            if(e.keyCode === 27){
                this.fullScreen(false)
            }
        }

        this.setState({
            height:document.documentElement.clientHeight - 60
        })
    }

    componentWillUnmount(){
        //取消全屏事件 关闭socket事件
        window.onkeyup = () => {}
        this.socket.onclose = () => {

        };
        this.socket.close()
        clearTimeout(this.timeout)
    }

    fullScreen = (val) => {
        const {uiStore: {changeWidthTag}} = this.props.rootStore;
        this.setState({
            full:val!==undefined ? val : !this.state.full
        }, changeWidthTag)
    }

    render(){
        const { echartsConfig,dataSource,currentDate } = this.state
        return (
            <div style={{position:"relative",height:"100%"}}>
                <div style={{background:"#ffffff",borderRadius:"5px",border:"1px solid #ffffff",padding:"20px",
                             height:"100%",marginTop:"20px"}}>
                    <div className="clear"></div>
                    <div style={{width:"60%",float:"left"}}>
                            {
                                this.state.full ? null :
                                    <div style={{position:"relative"}}>
                                        <div style={{position:"absolute",width:"100%",textAlign:"left",
                                                    top:"10px",left:"40px",color:"#333333",fontSize:"20px",
                                                    zIndex:"1"}}>
                                            <label style={{borderBottom:"1px solid #C5CDD0",paddingBottom:"5px"}}>
                                                <span style={{display:"inline-block",marginRight:"5px"}}>
                                                    <ServerTime time={currentDate}/>
                                                </span>
                                                <span>今日访问次数</span>
                                            </label>
                                        </div>
                                    </div>
                            }
                        <ShowPartFactory mapHeight={height} data={echartsConfig}
                                         height={height + "px"}/>
                    </div>
                    <div style={{width:"35%",float:"right"}}>
                        <div style={{width:"100%",height:"650px",border:"1px solid #C5CDD0",borderRadius:"5px",
                                     padding:"15px",marginTop:"50px"}}>
                            <div style={{textAlign:"left"}}>
                                <span style={{fontSize:"20px",lineHeight:"40px",display:"inline-block",
                                              marginBottom:"10px"}}>
                                    最近访问用户
                                </span>
                            </div>
                            <div className="visit-user">
                                <div style={{margin:"0px 10px"}}>
                                    <HiddenTable ellipsis line={2} columns={columns}
                                                 dataSource={dataSource} pagination={false}/>
                                </div>
                                <div className="get-more" style={{textAlign:"center"}} onClick={this.getAddSocket}>
                                    获取更多
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{position:"absolute",right:"0px",top:"30px"}}>
                    <Icon style={iconStyle} type="arrows-alt" onClick={()=>this.fullScreen()}/>
                </div>

                <div style={{display:this.state.full ? "block" :"none",position: "fixed", overflow: "auto", top: "0", right: "0", bottom: "0", left: "0",
                             zIndex: "1000",outline: "0",background:"#cccccc"}}>
                    <div style={{position:"relative",margin:"0px 20px"}}>
                        <div style={{position:"absolute",width:"100%",textAlign:"left",top:"10px",color:"#333333",fontSize:"20px",zIndex:"1"}}>
                            <label style={{borderBottom:"1px solid #C5CDD0",paddingBottom:"5px"}}>
                                <span style={{display:"inline-block",marginRight:"5px"}}>
                                    <ServerTime time={currentDate}/>
                                </span>
                                <span>今日访问次数</span>
                            </label>
                        </div>
                        <ShowPartFactory mapHeight={height} data={echartsConfig} height={height + "px"}/>
                        <Popover content={
                            <div style={{width:"300px",height:"600px"}}>
                                <div style={{textAlign:"center"}}>
                                    <span style={{fontSize:"20px",lineHeight:"40px"}}>最近访问用户</span>
                                </div>
                                <div className="visit-user">
                                    <HiddenTable ellipsis line={2} columns={columns} dataSource={dataSource} pagination={false}/>
                                    <div className="get-more" style={{textAlign:"center"}} onClick={this.getAddSocket}>
                                        获取更多
                                    </div>
                                </div>
                            </div>
                        } trigger="click" placement="topRight">
                            <span style={{display:"inline-block",position:"absolute",right:"0px",bottom:"20px",cursor:"pointer"}}>
                                <Icon type="plus" style={iconAddStyle}/>
                            </span>
                        </Popover>
                        <div style={{position:"absolute",right:"0px",top:"15px",textAlign:"right",zIndex:9999}}>
                            <Icon style={iconStyle} type="shrink" onClick={()=>this.fullScreen()}/>
                            <br/>
                            <span>按ESC键退出全屏模式</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}