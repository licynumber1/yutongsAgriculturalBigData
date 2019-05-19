/**
 * powered by 波比小金刚 at 2018-05-21 15:14:10 
 * last modified by 波比小金刚 at 2018-05-21 15:14:10 
 * @Description: 搜索框 
*/
import React, { Component } from 'react';
import { Input, message } from 'antd';
import {debounce} from '../../utils/utils';
import { SearchItemBoard } from './SearchItemsBoard';
import axios from '../../common/request';
import {observer, inject} from 'mobx-react';
import './index.less';
import searchIcon from '../../assets/svgEng/search.svg';

@inject('rootStore')
@observer
class SearchBox extends Component {

  constructor(props){
    super(props);
    this.state = {
      inputValue: '',
      searchResponseData: []
    }
    this.showSearchItemsList = false
    this.throttle = debounce(this.getLikeSearchResults, 500, false);
  }

  //TODO 与后台交互，获取模糊查询结果
  getLikeSearchResults = (...args) => {
    const { uiStore:{changeShowSearchItemList} } = this.props.rootStore;
    axios.get('fs/base/data/search/brief', {search_key: args[0]}).then(res => {
        if(res && res.data && res.data.code === 200 && res.data.result){
            this.setState({
              searchResponseData: res.data.result
             });
             changeShowSearchItemList(true);
        }else{
            if(res && res.data && res.data.msg){
                message.error( (res && res.data && res.data.msg) || '搜索出现错误')
            }
        }
    })
  }

  //* 处理输入框输入
  handleInputValue = e => {
    this.setState({inputValue: e.target.value});
    if(e.target.value !== undefined && e.target.value !== null && e.target.value !== ""){
        this.throttle(e.target.value);
    }
  }

    handleSearch = () => {
        const e = document.getElementById("input")
        this.setState({inputValue: e.value});
        if(e.value !== undefined && e.value !== null && e.value !== ""){
            this.throttle(e.value);
        }
    }

    componentWillUpdate(nextProps){
        const nextShowSearchItemsList = nextProps.rootStore.uiStore.showSearchItemsList;
        if(nextShowSearchItemsList === false && this.showSearchItemsList === true){
            this.setState({inputValue: ""})
        }
        this.showSearchItemsList = nextShowSearchItemsList
    }

  render() {
    const { inputValue, searchResponseData } = this.state;
    const { uiStore:{showSearchItemsList} } = this.props.rootStore;
    return (
      <div style={{position: 'relative'}}>
        <div className="ht-search-box">
          <Input
            style={{backgroundColor:"#f0f2f5"}}
            id="input"
            placeholder="内容、频道、景区"
            value={inputValue}
            onChange={e => this.handleInputValue(e)}
            onPressEnter={this.handleSearch}
          />
          <img alt="" style={{position: "absolute", right: "8px", top: "50%",
              transform: "translateY(-50%)"}} src={searchIcon} onClick={this.handleSearch}/>
        </div>
        {
          searchResponseData && showSearchItemsList ? <SearchItemBoard data={searchResponseData}/> : null
        }
      </div>
    );
  }
}

export default SearchBox;
