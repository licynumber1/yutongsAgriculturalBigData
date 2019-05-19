import  React,{Component } from 'react'
import { Button, Modal,Input } from 'antd'
import './index.less'
import {lengthValidator, requireValidator} from "../../shared/validator";
import {message} from "antd/lib/index";
import axios from "../../common/request";
import {inject, observer} from "mobx-react/index";
import PropTypes from "prop-types";
import NoRepeatButton from '../../shared/project/noRepeatButton'

const label = {
    title:"还没有数据看板，去创建新的数据看板吧",
}

@inject('rootStore')
@observer
export default class extends Component{
    constructor(props){
        super(props);
        this.state ={
            modalVisible:false,
            newBoardName:"",
            loading:false,
        }
    }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

    changeModalVisivle = (val) => {
        this.setState({
            modalVisible:val!==undefined ? val : !this.state.modalVisible
        })
    }

    changeLoading = (val) => {
        this.setState({
            loading:val!==undefined ? val : !this.state.loading
        })
    }

    handleCancelAddNewBoard = (e) => {
        if(e && e.stopPropagation){
            e.stopPropagation()
        }
        this.changeModalVisivle()
        this.clearInputLabel()
    }

    clearInputLabel = () => {
        this.setState({
            newBoardName:""
        })
    }

    getMenu() {
        // const { menuStore:{ changeMenu } } = this.props.rootStore;
        // axios.getWithoutCancel(`fs/base/data/board/get/menu`, {}).then(res=>{
        //     if(res && res.data && res.data.code === 200 && res.data.result){
        //         changeMenu(res.data.result)
        //     }else{
        //         message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
        //     }
        // })
    }

    //* 确定新增看板
    handleSureAddNewBoard = () => {
        const { newBoardName } = this.state;
        if(requireValidator({value:newBoardName},'看板名称不能为空')
            && lengthValidator({value:newBoardName},'看板名称最多10个字')
        ){
            this.changeLoading(true)
            axios.put(`fs/base/data/board/save`, {
                board_name:newBoardName.replace(/(^\s*)|(\s*$)/g, ""),
            }).then(res=>{
                if(res && res.data && res.data.code === 200 && res.data.result){
                    this.changeModalVisivle()
                    this.clearInputLabel()
                    this.getMenu()
                    this.timeout = setTimeout(()=>{
                        this.jump(`/data/${res.data.result}`)
                    },200)
                }else{
                    message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
                }
                this.changeLoading(false)
            })
        }
    }

    onChangeHandler = e => {
        this.setState({newBoardName: e.target.value});
    }

    jump = (url) => {
        this.context.router.history.push(url)
    }

    render(){
        //handleCancelAddNewBoard handleSureAddNewBoard
        const height = (document.getElementsByTagName('body')[0].clientHeight - 260)/2 + 'px'
        return (
            <div className='empty-container'>
                <div className='empty-inner'>
                    <p className='label-center'>{label.title}</p>
                    <Button style={{display:"inline-block",height:"34px",borderRadius:"2px",width:"110px"}}
                                    disabled={this.state.disable}
                            onClick={()=>this.changeModalVisivle(true)} type="primary">创建</Button>
                    <Modal visible={this.state.modalVisible} cancelText="取消" okText="确认"
                           onCancel={this.handleCancelAddNewBoard}
                           width={310}
                           style={{ top: height, height:"175px" }}//260
                           footer={false}
                           closable={false}
                           confirmLoading={this.state.loading}
                    >
                        <div style={{width:"100%"}}>
                            <div className='new-board-component-warpper'>
                                <h1 style={{
                                    fontSize: "18px",
                                    fontWeight: "normal",
                                    fontStretch: "normal",
                                    letterSpacing: "0px",
                                    color: "#000000",
                                }}>创建新的数据看板</h1>
                                <Input style={{height:"36px",borderRadius:"2px"}} placeholder='看板名称最多10个字' value={this.state.newBoardName} onChange={e => this.onChangeHandler(e)}/>
                                <div>
                                    <Button style={{width:"110px"}} onClick={this.handleCancelAddNewBoard}>取消</Button>
                                    <NoRepeatButton style={{width:"110px"}} onClick={this.handleSureAddNewBoard} type="primary">确认</NoRepeatButton>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        clearTimeout(this.timeout)
    }
}
