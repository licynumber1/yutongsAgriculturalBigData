/**
 * powered by 波比小金刚 at 2018-05-23 19:25:48 
 * last modified by 波比小金刚 at 2018-05-23 19:25:48 
 * @Description: 按照 mobx 最佳实践，通过 UIStore 控制页面的一些 UI 效果
 *  
*/

import { observable, action } from 'mobx'

export default class UIStore {
  //* header 搜索框的隐藏与显示
  @observable showSearchItemsList = false;
  @observable modalList = {
    emailModal:false,
    editorModal:false,
    shareModal:false
  }
  @observable widthTag = 0;

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  //* 隐藏 header 搜索框
  @action.bound
  changeShowSearchItemList(bool){
    this.showSearchItemsList = bool;
  }

  @action.bound
  changeShowModal(key){
    const o ={
      emailModal:false,
      editorModal:false,
      shareModal:false,
    }
    this.modalList ={
      ...o,
      [key]:!this.modalList[key]
    }
  }

    @action.bound
    clearShowModal(key){
        this.modalList ={
            [key]:false
        }
    }

    @action.bound
    changeWidthTag(){
        this.widthTag = this.widthTag+1;
    }
}
