import React,{Component} from 'react';
import {SelectBox} from './selectBox'
import {observer} from 'mobx-react';
import axios from '../../common/request';
import { throttleForkedFromUnderScore } from '../../utils/utils';
import { Popover, Icon } from 'antd'

@observer
export default class extends Component{
  constructor(props){
    super(props);
    this.state ={
      target:'',
      keyWord:'',
      topTitles:[],
      titleList:[],
      targetList:[]
    }
      this.keyWordChange = throttleForkedFromUnderScore(this.getItemsByKeyWord, 5000, {leading: false});
      this.keyWordSearch = throttleForkedFromUnderScore(this.getItemsByKeyWord, 500, {leading: false});
  }
  handleChange = ()=>{
    // this.setState({isShow:true})
  }
  handleClick = ()=>{
    this.setState({isShow:true})
  }
  handleChangeTarget = target=>{
    // console.log(target);
    this.setState({
      target:target.name,
      id:target.id
    })
    this.props.onClick(target.id)
  }

  getTopTitles(){
    axios.get('/fs/base/data/item/getTopTitle').then(res => {
      if(res && res.data){
        const {success, result,} = res.data;
        if(success){
          this.setState({
            titleList: result
          });
          // changeShowSearchItemList(true);
        }
      }
    })
  }

  getItemsByKeyWord(o){
    this.getItems(o)
  }

  async getItems(o ={}){
    const {keyword,topTitles} = this.state;
    const params ={
      keyword,
      topTitles,
      ...o
    };
    try {
      const {data:{success,result}} = await  axios.get('/fs/base/data/item/getItems',params);
      if (success && result) {
        this.setState({targetList:result.topTitles || []})
      }else {
          this.setState({targetList:[]})
      }
    } catch(e){

    }
  }
  handleCheckBoxChange = list=>{
    // console.log(e);
    const topTitles = list.join(',')
    this.setState({topTitles})
    this.getItems({topTitles})
  }
  handleKeyWordChange = (e) =>{
    const value = e.target ? e.target.value : e.value
    this.setState({keyWord: value});
    this.keyWordSearch({title:value});
  }
  componentDidMount(){
    this.getTopTitles();
    this.getItems();
  }
  onVisibleChange = (val) => {
    if(val === false){
        this.getTopTitles();
        this.getItems();
        this.clearKeyWord();
    }
  }
  clearKeyWord = () => {
      this.setState({
          keyWord:""
      })
  }

  render(){
    const {className ='',placeholder='',style={}}= this.props;
    const { target, titleList, targetList, keyWord } = this.state;
    return (
        <div style={style} className={`data-select ${className}`} onClick={this.handleClick.bind(this)}>
            <Popover onVisibleChange={this.onVisibleChange} content={<div
                style={{
                    width: '374px',
                    height: '412px',
                }}
                onClick = {this.handleClick}
            >
                <SelectBox
                    onChange ={this.handleCheckBoxChange}
                    checkOptions ={titleList}
                    targetList ={targetList}
                    keyWord ={keyWord}
                    handleKeyWordChange = {this.handleKeyWordChange}
                    handleChangeTarget = {this.handleChangeTarget}
                />
            </div>}>
                <div className="input-header">
                    <input placeholder={placeholder} readOnly value={target} type="text"/>
                    <Icon style={{position:"relative",left:"-8px"}} type="down" />
                </div>
            </Popover>
        </div>
    )
  }
}