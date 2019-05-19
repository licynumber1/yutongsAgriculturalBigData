/**
 * powered by 波比小金刚 at 2018-05-07 14:48:25
 * last modified by 波比小金刚 at 2018-05-07 14:48:25
 * @Description: 利用 antd 进行基本响应式布局
*/
import React from 'react';
import { Layout, Icon } from 'antd';
import { ContainerQuery } from 'react-container-query';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import SideMenu from '../components/SideMenu';
import {menuData} from '../common/menu';
import {Switch, Route} from 'react-router-dom';
import AuthRoute from '../components/AuthRoute';
import logo from '../assets/icons/fishsaying.png';
import PropTypes from 'prop-types';
import {getRouterData} from '../common/router';
import SearchBox from '../components/SearchBox';
import UserLogin from '../components/UserLogin';
import {observer, inject} from 'mobx-react';
import './index.less';
import axios from '../common/request';
import {message} from "antd/lib/index";
import Power from '../components/Power'
import GetWrapperWidth from "../shared/getWrapperWidth";
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'

const { Content, Header } = Layout

//* 利用 react-container-query 进行响应式设计
const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200
  }
}

//* context路由处理
const getRoutes = (location, data) => {
  const {pathname} = location;
  return data
    .filter(item => {
        //return item.path && item.component && pathname === item.path //
        return item.path && item.component
    })
    .map(item => (
      pathname === '/' ? 
      <Route
        key={item.key}
        path={item.path}
        render={props => item.component}
        exact={item.exact}
      /> :
      <AuthRoute
        withoutCheck={true}
        key={item.key}
        path={item.path}
        render={props => item.component}
        exact={item.exact}
      />
  ))
}

@inject('rootStore')
@observer
class BasicLayout extends React.Component {
  state = {
    collapsed: false,
    menuData:menuData
  }

    static contextTypes = {
        location: PropTypes.object,
        router: PropTypes.object.isRequired
    };

  //TODO 根据路由的配置获取网页的标题
  getPageTitle() {
    let title = '数据监测系统'
    return title
  }

  //TODO 展开-收起时的回调函数
  handleMenuCollapse = payload => {}

  componentDidMount() {
      this.getMenu()
      this.getCollection()
  }

    jump = (url,state) => {
        this.context.router.history.push({pathname:url,state})
    }

  getMenu = () => {
      const { menuStore:{changeMenu, menu},userStore:{userId} } = this.props.rootStore;
      // axios.getWithoutCancel(`fs/base/data/board/get/menu`, {}).then(res=>{
      //     if(res && res.data && res.data.code === 200 && res.data.result){
      //         changeMenu(res.data.result)
      //     }else if(userId){
      //         message.error( (res && res.data && res.data.msg) || '获取菜单栏失败');
      //     }
      // })
  }

    getCollection = () => {
    // console.log(1)
    //     const { menuStore:{changeCollection},userStore:{userId} } = this.props.rootStore;
    //     axios.postJSONWithoutCancel(`/fs/base/data/collection/getList`, {}).then(res=>{
    //         if(res && res.data && res.data.code === 200 && res.data.result){
    //             changeCollection(res.data.result)
    //         }else if(userId){
    //             message.error( (res && res.data && res.data.msg) || '获取收藏栏失败');
    //         }
    //     })
    }

  //
  getMenuConfig(data) {
      //001
    let menu = menuData
    const menuItems = data.map(i=>{
        //todo:菜单栏icon
      return {
          authority : i.user_id,
          hideInMenu : false,
          icon : "",
          name : i.board_name || "",
          path : `data/${i.id}`,
    }})
      menu[0].children[0].children = menuItems
      return menu
  }


  //TODO 点击按钮折叠展开侧边栏
  handleToggleCollapsed = () => {
      const {uiStore: {changeWidthTag}} = this.props.rootStore;
      this.setState({ collapsed: !this.state.collapsed })
      setTimeout(changeWidthTag,100)
  }

  //* 全局的点击，UI 的控制，比如一些窗口的关闭
  handleChangeUIStore = () => {
    const {uiStore: {changeShowSearchItemList}} = this.props.rootStore;
    changeShowSearchItemList(false);
  }

  render() {
    const { collapsed } = this.state
    const { location } = this.props
    const { menuStore:{menu} } = this.props.rootStore;
    //* antd 布局
    const layout = (
      <Layout style={{ height: '100%' }} onClick={this.handleChangeUIStore}>
        <SideMenu
          logo={logo}
          menu={menu} //作为menu修改的标识
          menuData={this.getMenuConfig(menu.slice())}
          collapsed={collapsed}
          location={location}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout className="layout">
          <Header style={{ padding: 0, backgroundColor: '#fff' }}>
            <Icon
              className="layout-icon-handler"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              style ={{cursor:'pointer',marginLeft:"15px"}}
              onClick={this.handleToggleCollapsed}
            />
            <div className='ht-header-right-box'>
              <SearchBox />
              <Power />
              <UserLogin />
            </div>
          </Header>
          <Content style={{ margin: '0px 20px 0', height: '100%' }}>
            <Switch>
              {
                getRoutes(location, getRouterData())
              }
              <Route render={props => <h1>404</h1>}/>
            </Switch>
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
            <Fragment>
              Copyright <Icon type="copyright" /> 2018 成都鱼说科技技术部出品
            </Fragment>
          </Footer> */}
        </Layout>
      </Layout>
    )
    return (
        <LocaleProvider locale={zh_CN}>
            <GetWrapperWidth>
                <DocumentTitle title={this.getPageTitle()}>
                    <ContainerQuery query={query}>
                        {params => (
                            <div className={classNames(params, { [`base-layout`]: true })}>
                                {layout}
                            </div>
                        )}
                    </ContainerQuery>
                </DocumentTitle>
            </GetWrapperWidth>
        </LocaleProvider>
    )
  }
}

export default BasicLayout
