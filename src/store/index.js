/**
 * powered by 波比小金刚 at 2018-05-07 17:43:18
 * last modified by 波比小金刚 at 2018-05-07 17:43:18
 * @Description:  统一管理 Store 是最佳实践
 */
import UserStore from './userStore'
import UIStore from './uiStore';
import MenuStore from './menuStore';
class Store {
  //* 组合多个store
  //! 不同的store之间可以实现通信
  constructor() {
    this.userStore = new UserStore(this)
    this.uiStore = new UIStore(this)
    this.menuStore = new MenuStore(this)
  }
}

export const store = new Store()
