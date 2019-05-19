
import { observable, action } from 'mobx'

export default class MenuStore {
    //* 获取菜单的属性
    @observable menu = []
    @observable collection = []

    @action.bound
    changeMenu(menu) {
        console.log(this.menu,menu)
        this.menu = menu // 'this' 永远都是正确的
    }
    @action.bound
    changeCollection(collection){
        this.collection = collection
    }


    constructor(rootStore) {
        this.rootStore = rootStore
    }
}