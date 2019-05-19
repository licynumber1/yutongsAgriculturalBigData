/**
 * powered by 波比小金刚 at 2018-05-07 10:50:27
 * last modified by 波比小金刚 at 2018-05-07 10:50:27
 * @Description: 路由控制
 */
import React from 'react'
import { HashRouter as Router, Switch,Route } from 'react-router-dom'
import BasicLayout from './layouts/BasicLayout'
import LeeIndex from './pages/leeIndex'
import Login from './pages/login'
import { Provider } from 'mobx-react'
import { store } from './store'
import AuthRoute from './components/AuthRoute'
import Share from './pages/share'
import ShareDetails from './pages/shareDetails'
import ShareDrillDown from './pages/shareDrillDown'
import { Layout, Icon } from 'antd';

export const Routes = () => (
  <Provider rootStore={store}>
    <Router>
      <Switch>
        <Route path ="/share/:id" render = {()=><Share />} />
        <Route path ="/shareDrillDown/:id" render = {()=><ShareDrillDown />} />
        <Route path ="/shareDetails/:id" render = {()=> <ShareDetails />} />
        <Route path="/login" render={() => <Login />} />
        <AuthRoute path="/data" render={props => <BasicLayout {...props} />} />
        <Route path="/" render={() => <LeeIndex />} />
      </Switch>
    </Router>
  </Provider>
)
