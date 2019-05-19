/**
 * powered by 波比小金刚 at 2018-05-07 15:45:18
 * last modified by 波比小金刚 at 2018-05-07 15:45:18
 * @Description: 侧边栏组件
 */
import React from 'react'
import { Layout, Menu, Icon, Input, Button, Popover, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import './index.less'
import PropTypes from 'prop-types'
import {message} from "antd/lib/index";
import axios from "../../common/request";
import {inject, observer} from "mobx-react/index";
import { requireValidator,lengthValidator } from '../../shared/validator/index'
import NoRepeatButton from '../../shared/project/noRepeatButton'
import addIcon from '../../assets/svgEng/add.svg';
import qs from 'qs'
import PopoverSpan from '../../shared/project/PopoverSpan'
import { colorLabelMap } from '../../utils/utils'

const { Sider } = Layout
const { SubMenu } = Menu

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className="icon sider-menu-item-img" />
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} style={{fontSize:"16px"}}/>
  }
  return icon
}

@inject('rootStore')
@observer
class SideMenu extends React.Component {
  constructor(props) {
    super(props)
    this.menus = props.menuData
    this.state = {
      openKeys: this.getDefaultOpenKeys(props.menuData),
      showAddBoardTip: false,
      newBoardName: '',
      disable:false,
      selectedKeys:[],
      colKey:[],
    }
  }

  static propTypes = {
    logo: PropTypes.string.isRequired,
    collapsed: PropTypes.bool.isRequired,
    onCollapse: PropTypes.func.isRequired,
    menuData: PropTypes.array.isRequired,
  }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };


  static defaultProps = {
    logo: '',
    collapsed: false,
    onCollapse: () => {},
    menuData: []
  }

  changeSelectKey = (e) => {
      if(e.key){
          this.setState({
              selectedKeys:[e.key],
              colKey:[],
          })
      }
  }

    changeColKey = (e) => {
        if(e.key){
            this.setState({
                colKey:[e.key],
                selectedKeys:[],
            })
        }
    }

  //* 获取menuData的第一层key
  getDefaultOpenKeys(menuData) {
    const defaultOpenKeys = menuData.filter(
      item => item.name && !item.hideInMenu
    )[0]
    return defaultOpenKeys ? [`${defaultOpenKeys['path']}`] : []
  }

  getPopSpan = (val) => {
      return <span style={{maxWidth:'150px',display:"inline-block",fontSize:"14px",marginLeft:"10px"}}>{val}</span>
  }

  getCollectionPopSpan= (val) => {
      return (
          <PopoverSpan popData={val || "暂无描述"} data={
              <span style={{display:"inline-block",maxWidth:'130px',overflow:"hidden",textOverflow: "ellipsis",whiteSpace: "nowrap",}}>{val}</span>
          } />
      )
  }

    onConfirm = (id) => {
        this.onDelete(id)
    }

    onConfirmCollection = (data) => {
        this.collection(data)
    }

    onDelete = (id) => {
        const parse = {
            boardID:id
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

  //* 返回Link或者是a标签
  getMenuItemPath = item => {
    const itemPath = this.transformPath(item.path)
    const icon = getIcon(item.icon)
    const { target, name } = item
    // http link
      let addpart
      if(item.path === '/'){
         if(this.state.showAddBoardTip){
             addpart = <img alt="" className="ht-sider-add-new" style={{position:"relative",top:"3px",right:"-30px"}} src={addIcon} onClick={e => this.handleAddNewBoard(e)}/>
         }else{
             addpart = <img alt="" className="ht-sider-add-new" style={{position:"relative",top:"3px",right:"-30px"}} src={addIcon} onClick={e => this.handleAddNewBoard(e)}/>
         }
      }else if(!item.outter){
            const id = item.path.split("/") && item.path.split("/").length > 0 && item.path.split("/")[1]
          addpart = (<Popconfirm title={`确认删除看板"${item.name}"？`} okText="确认"
                                 cancelText="取消" onConfirm={()=>this.onConfirm(id)}>
                <Icon style={{color:"#333333"}} type="delete" />
            </Popconfirm>)
          //addpart = <Icon style={{color:"#333333"}} type="delete" /> || <img alt="" className="ht-sider-add-new" style={{position:"absolute",top:"9px",right:"-30px"}} src={addIcon} onClick={e => this.handleAddNewBoard(e)}/>
      }
      else{
          addpart = ""
      }
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target} style={{position:"relative"}}>
          {icon}
            {addpart}
            {this.getPopSpan(name)}
        </a>
      )
    }
    return (
      <span>
         <Link
             to={itemPath}
             target={target}
             replace={itemPath === this.props.location.pathname}
             onClick={() => this.props.onCollapse(true)}
         >
             <span style={{display:'inline-block',minWidth:"175px"}}>
               {icon}
               {this.getPopSpan(name)}
             </span>
        </Link>
          {addpart}
      </span>
    )
  }

  isMainMenu = key => {
    return this.menus.some(
      item => key && (item.key === key || item.path === key)
    )
  }

  //* 新增面板
  handleAddNewBoard = (e) => {
    e.stopPropagation()
    this.setState({showAddBoardTip: !this.state.showAddBoardTip});
  }

  //* SubMenu 展开/关闭的回调
  handleOpenChange = openKeys => {
    const lastOpenKeys = openKeys[openKeys.length - 1]
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
    this.setState({
      openKeys: moreThanOne ? [lastOpenKeys] : [...openKeys]
    })
  }

  //* 生成侧边栏
  getSubMenuOrItem = item => {
    if (item.children) {
      const childrenItems = this.getNavMenuItems(item.children)
      // 没有子菜单的时候就不用显示
      if (childrenItems && childrenItems.length >= 0) {
          return (
              <SubMenu
                  title={
                      <span style={{display:"inline-block"}}>
                  {item.icon ? getIcon(item.icon) : ""}
                          <span style={{display:"inline-block",marginLeft:"8px",fontSize:"16px"}}>{item.name}</span>
                          {/*{*/}
                                  {/*<Popover trigger="click" onVisibleChange={this.handleCancelAddNewBoard}*/}
                                           {/*visible={this.state.showAddBoardTip} placement="rightTop"*/}
                                           {/*content={ <div className="ht-new-board">*/}
                                      {/*<div className='new-board-component-warpper' onClick={(e)=>e.stopPropagation()}>*/}
                                          {/*<h1>创建新的数据看板</h1>*/}
                                          {/*<Input style={{display:"inline-block",height:"36px",borderRadius:"2px"}} placeholder='看板名称最多10个字'*/}
                                                 {/*value={this.state.newBoardName} onChange={e => this.onChangeHandler(e)}/>*/}
                                          {/*<div>*/}
                                              {/*<Button style={{display:"inline-block",height:"36px",borderRadius:"2px"}} onClick={this.handleCancelAddNewBoard} type="primary" ghost>取消</Button>*/}
                                              {/*<NoRepeatButton style={{display:"inline-block",height:"34px",borderRadius:"2px"}}*/}
                                                              {/*disabled={this.state.disable}*/}
                                                              {/*onClick={this.handleSureAddNewBoard} type="primary">确定</NoRepeatButton>*/}
                                          {/*</div>*/}
                                      {/*</div>*/}
                                  {/*</div>}>*/}
                                      {/*<img alt="" className="ht-sider-add-new" src={addIcon} onClick={e => this.handleAddNewBoard(e)}/>*/}
                                  {/*</Popover>*/}
                          {/*}*/}
                </span>
                  }
                  key={item.path}
              >
                  {childrenItems}
              </SubMenu>
          );
      }
      return null
    } else {
      return <Menu.Item style={item.outter ? {marginLeft:"12px"} : {}} key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
    }
  }

  //* 对 menuData 的处理
  getNavMenuItems = menuData => {
    if (!menuData) return []
    return menuData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        const subMenuDom = this.getSubMenuOrItem(item)
        return subMenuDom
      })
      .filter(item => item)
  }

  //* 路径转换
  transformPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/')
    }
  }

  clearInputLabel = () => {
      this.setState({
          newBoardName:""
      })
  }

  //* 取消新增看板
  handleCancelAddNewBoard = (e) => {
    if(e && e.stopPropagation){
        e.stopPropagation()
    }
    this.setState({showAddBoardTip: !this.state.showAddBoardTip});
    this.clearInputLabel()
  }

  //* 确定新增看板
  handleSureAddNewBoard = () => {
    const { newBoardName } = this.state;
    // TODO 这里访问后端上传新的看板，并且在计算函数中触发拉取新的列表并且rerender
      if(requireValidator({value:newBoardName},'看板名称不能为空')
          && lengthValidator({value:newBoardName},'看板名称最多10个字')
      ){
            axios.put(`fs/base/data/board/save`, {
                board_name:newBoardName.replace(/(^\s*)|(\s*$)/g, ""),
            }).then(res=>{
                if(res && res.data && res.data.code === 200 && res.data.result){
                    this.setState({
                        showAddBoardTip:false
                    })
                    this.clearInputLabel()
                    this.getMenu()
                    this.timeout = setTimeout(()=>{
                        this.jump(`/data/${res.data.result}`)
                    },200)
                }else{
                    message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
                }
            })
      }
  }

    componentWillUnmount(){
        clearTimeout(this.timeout)
    }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
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

  //* 输入框onchange
  onChangeHandler = e => {
    this.setState({newBoardName: e.target.value});
  }

    getSelectedKeys = () => {
        const { menuStore:{menu} } = this.props.rootStore;
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        if(menu.slice().map(i=>i.id).find(i=>i===id)){
            return this.state.selectedKeys.concat(menu.slice().map(i=>i.id).find(i=>i===id))
        }
        return this.state.selectedKeys
    }

    dedupe = (array) => {
        return Array.from(new Set(array));
    }

    getSelectKeys = () => {
        const { menuStore:{menu} } = this.props.rootStore;
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        const arr = [("data/"+menu.slice().map(i=>i.id).find(i=>i===id))]
        return (
            menu.slice().map(i=>i.id).find(i=>i===id) ?
                arr.filter((i,iIndex)=>{
                    let tag = true
                    arr.forEach((j,jIndex)=>{
                        if(i === j && iIndex > jIndex){
                            tag = false
                        }
                    })
                    return tag
                }) :
                []
        )

    }

    collection = ({label,id,title}) => {
        const url = "cancel"
        const parse = qs.stringify({
            title,
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

    getCollection = () => {
      console.log(3)
        const { menuStore:{changeCollection},userStore:{userId} } = this.props.rootStore;
        axios.postJSONWithoutCancel(`/fs/base/data/collection/getList`, {}).then(res=>{
            if(res && res.data && res.data.code === 200 && res.data.result){
                changeCollection(res.data.result)
            }else if(userId){
                message.error( (res && res.data && res.data.msg) || '获取收藏栏失败');
            }
        })
    }

  render() {
    const { logo, collapsed, onCollapse } = this.props
    const { openKeys } = this.state
    const menuProps = collapsed ? {} : { openKeys }
    const selectedKeys = this.getSelectKeys()
    const height = (document.getElementsByTagName('body')[0].clientHeight - 60 - 16 - 30 +'px')
    const { menuStore:{collection} } = this.props.rootStore;
    const fixCollection = collection.slice().map(i=>{
        return {
            id:i.contentID,
            label:i.label,
            name:i.title
        }
    })
    const urlArr = window.location.href.split('/')
    const addColKey = urlArr[urlArr.length-3] === "search" ? [urlArr[urlArr.length-2]] : []
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={250}
        className="sider"
        style={{ backgroundColor: '#ffffff',fontSize:"16px",position:"relative" }}
      >
        <div className="logo" key="logo">
          <Link to="/">
            {/*<img src={logo} alt="logo"/>*/}
            {/*<span style={{margin:"0 auto",display:"inline-block",width:"28px",height:"60px",background:`no-repeat left url(${logo})`,}}></span>*/}
            <span style={{display:"inline-block",width:"190px",height:"60px",background:`no-repeat -28px url(${logo})`,}}></span>
          </Link>
        </div>
        <Menu
          key="Menu"
          theme="light"
          mode="inline"
          onClick={this.changeSelectKey}
          onOpenChange={this.handleOpenChange}
          selectedKeys={ selectedKeys }
          {...menuProps}
          style={{
            padding: '16px 0',
            width: '100%',
            backgroundColor: '#ffffff'
          }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
          {/*<Popover content={*/}
              {/*<div style={{height:height, width:"270px", overflowY:"scroll"}}>*/}
                  {/*<div>*/}
                      {/*<Menu*/}
                          {/*style={{ width: 256 }}*/}
                          {/*defaultOpenKeys={['sub1']}*/}
                          {/*mode="inline"*/}
                          {/*selectedKeys={*/}
                              {/*this.state.colKey.length === 0 ? addColKey : this.state.colKey*/}
                          {/*}*/}
                      {/*>*/}
                          {/*<SubMenu key="sub1" title={<span style={{fontSize:'16px'}}><Icon type="mail" /><span>我的收藏</span></span>}>*/}
                              {/*{*/}
                                  {/*fixCollection.map((i)=>{*/}
                                      {/*return (*/}
                                          {/*<Menu.Item key={i.id}>*/}
                                              {/*<span>*/}
                                                 {/*<Link*/}
                                                     {/*to={{ pathname:`/search/${i.id}/${i.label}` }}*/}
                                                 {/*>*/}
                                                     {/*<span style={{display:'inline-block',minWidth:"140px"}}>*/}
                                                         {/*{this.getCollectionPopSpan(i.name)}*/}
                                                     {/*</span>*/}
                                                     {/*<span style={{backgroundColor:colorLabelMap[i.label] || "#000000",color:"#ffffff",position:"relative",top:"-15px"}}>*/}
                                                            {/*{ i.label }*/}
                                                     {/*</span>*/}
                                                {/*</Link>*/}
                                              {/*</span>*/}
                                              {/*<Popconfirm title={`确认删除收藏"${i.name}"？`} okText="确认"*/}
                                                          {/*cancelText="取消" onConfirm={()=>this.onConfirmCollection(i)}>*/}
                                                  {/*<Icon style={{color:"#333333",position:"relative",top:"-15px"}} type="delete" />*/}
                                              {/*</Popconfirm>*/}
                                          {/*</Menu.Item>*/}
                                      {/*)*/}
                                  {/*})*/}
                              {/*}*/}
                          {/*</SubMenu>*/}
                      {/*</Menu>*/}
                      {/*/!*<Menu>*!/*/}
                      {/*/!*{*!/*/}
                          {/*/!*( [{*!/*/}
                              {/*/!*authority : "admin",*!/*/}
                              {/*/!*hideInMenu : false,*!/*/}
                              {/*/!*icon : "dot-chart",*!/*/}
                              {/*/!*name : "访问地图",*!/*/}
                              {/*/!*outter : true,*!/*/}
                              {/*/!*path : "/map"*!/*/}
                          {/*/!*}] ).map(item=>{*!/*/}
                              {/*/!*<Menu.Item style={item.outter ? {marginLeft:"12px"} : {}} key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>*!/*/}
                          {/*/!*})*!/*/}
                      {/*/!*}*!/*/}
                      {/*/!*</Menu>*!/*/}
                  {/*</div>*/}
              {/*</div>*/}
          {/*}*/}
          {/*placement="right"*/}
          {/*>*/}
              {/*<div style={{position:"absolute",bottom:"0px",width:"100%",height:"50px",lineHeight:"50px",textAlign:"center",cursor: "pointer"}}>我的收藏</div>*/}
          {/*</Popover>*/}
        {/*{*/}
          {/*this.state.showAddBoardTip ?*/}
          {/*<div className="ht-new-board">*/}
            {/*<div className='new-board-component-warpper'>*/}
              {/*<h1>创建新的数据看板</h1>*/}
              {/*<Input placeholder='' value={newBoardName} onChange={e => this.onChangeHandler(e)}/>*/}
              {/*<div>*/}
                {/*<Button onClick={this.handleCancelAddNewBoard} type="primary" ghost>取消</Button>*/}
                {/*<Button onClick={this.handleSureAddNewBoard} type="primary">确定</Button>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*: null*/}
        {/*}*/}
      </Sider>
    )
  }
}

export default SideMenu
