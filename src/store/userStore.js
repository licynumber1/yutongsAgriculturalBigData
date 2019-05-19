/**
 * powered by 波比小金刚 at 2018-05-07 17:44:12
 * last modified by 波比小金刚 at 2018-05-07 17:44:12
 * @Description: 用户的状态管理
 */
import { observable, action } from 'mobx'

export default class UserStore {
  //* 用户的一些属性
  @observable userId = ''
  @observable userName = ''
  @observable userIcon = ''
  @observable userAuthority = ''
  @observable power = 0 //权限
  @observable isCloseRobot = '0' //是否展示数据

    @action.bound
    changeProps([userId,userName,userIcon,userAuthority]) {
        this.userId = userId
        this.userName = userName
        this.userIcon = userIcon
        this.userAuthority = userAuthority
    }

    @action.bound
    changePower(data) {
        this.power = data
    }

    @action.bound
    changeIsCloseRobot(data) {
        this.isCloseRobot = data
    }

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  //TODO 用户权限校验等方法
}
