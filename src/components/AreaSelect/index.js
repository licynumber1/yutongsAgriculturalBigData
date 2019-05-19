/**
 * powered by 波比小金刚 at 2018-05-24 10:34:22 
 * last modified by 波比小金刚 at 2018-05-24 10:34:22 
 * @Description: 区域三级联动组件 
*/
import React, { Component } from 'react';
import './index.less';
import axios from '../../common/request';
import { Select, message } from 'antd';
const Option = Select.Option;

let provinceCache = {};

// ? 封装一个命令集，使得代码结构清晰，降低耦合
const AreaSelectCommandsManager = {
  withKey : (arr) => {
      return arr.map((v,i)=>{
          v.key = i;
          return v
      })
  },
  privince: function(type, value, cb){
    //* 利用缓存节省网络开销
      if(!!this.checkintercept(value)){
          //* 对于点选未选择项的数据
          cb([])
          return
      }
    if(provinceCache['provinces']){
      cb(provinceCache['provinces']);
    }else{
      let param = {type}
      axios.getWithoutCancel('http://restapi-test1.fishsaying.com/sso/area/query', param).then(res=>{
        if(res && res.status === 200 && res.data.length){
          cb(res.data);
          provinceCache['provinces'] = res.data;
        }else{
           message.error( (res && res.data && res.data.msg) || '获取区域数据失败');
        }
      })
    }
  },
  city: function(type, value, cb){
    //* 利用缓存节省网络开销
    if(!!this.checkintercept(value)){
        //* 对于点选未选择项的数据
        cb([])
        return
    }
    if(provinceCache[`${value}-${type}`]){
      cb(provinceCache[`${value}-${type}`]);
    }else{
      let param = {type, province: value};
      axios.getWithoutCancel('http://restapi-test1.fishsaying.com/sso/area/query', param).then(res=>{
        if(res && res.status === 200 && res.data.length){
          cb(res.data);
          provinceCache[`${value}-${type}`] = res.data;
        }else{
           message.error( (res && res.data && res.data.msg) || '获取区域数据失败');
        }
      })
    }
  },
  district: function(type, value, cb){
    //* 利用缓存节省网络开销
      if(!!this.checkintercept(value)){
          //* 对于点选未选择项的数据
          cb([])
          return
      }
    if(this.checkintercept(value)){
       return
    }
    if(provinceCache[`${value}-${type}`]){
      cb(provinceCache[`${value}-${type}`]);
    }else{
      let param = {type, city: value};
      axios.getWithoutCancel('http://restapi-test1.fishsaying.com/sso/area/query', param).then(res=>{
        if(res && res.status === 200 && res.data.length){
          cb(res.data);
          provinceCache[`${value}-${type}`] = res.data;
        }else{
            message.error( (res && res.data && res.data.msg) || '获取区域数据失败');
        }
      })
    }
  },
  checkintercept:function(val){
      return val === undefined
  },
  others: function(type, value, cb){
    cb(value);
  },
  execute: function(command){
    return AreaSelectCommandsManager[command] && 
      AreaSelectCommandsManager[command].apply( AreaSelectCommandsManager, [].slice.call(arguments, 1) );
  }
}

const initState = {
    city: [],
    district: [],
    municipalityDisabled: false,
    defaultProvinces: '--未选择--',
    defaultCity: '--未选择--',
    defaultDistrict: '--未选择--',
    provincesId:undefined,
    cityId:undefined,
    districtId:undefined,
}

class AreaSelect extends Component {
  constructor(props){
    const urlArr = window.location.href.split('/')
    const id = urlArr[urlArr.length - 1]
    super(props);
    this.state = {
      id:id,
      provinces: [],
      ...initState,
    }
  }

  reset = () => {
      this.setState({
          ...initState
      })
  }

  componentDidMount(){
    AreaSelectCommandsManager.execute('privince', 'province', '', (data) => {
      this.setState((preState, props) => ({provinces: data}));
    });
  }

    componentWillReceiveProps(nextProps) {//当id发生变化时,需重新将界面的数据清空
       const urlArr = window.location.href.split('/')
       const id = urlArr[urlArr.length - 1]
        if(id !== this.state.id){
          this.setState({
              id,
              ...initState,
          })
        }
    }

  //? 选择事件
  handleOnChange = (id, type, label) => {
    const cb = this.props.onChange
    const value = label.length ? label[0].name : undefined
    const valueLabel = value || '--未选择--'
    AreaSelectCommandsManager.execute(type, type, value, (data) => {
      if(type === 'others'){
        this.setState((preState, props) => ({
          defaultDistrict: valueLabel,
          districtId: id
        }));
          cb({
              defaultProvinces: this.state.defaultProvinces,
              defaultCity: this.state.defaultCity,
              defaultDistrict: valueLabel,
              provincesId: this.state.provincesId,
              cityId: this.state.cityId,
              districtId: id,
          })
      }else{
        const stateData = {
            defaultProvinces: type === 'city' ? valueLabel : this.state.defaultProvinces,
            defaultCity: type === 'city' ? '--未选择--' : valueLabel,
            defaultDistrict: '--未选择--',
            provincesId: type === 'city' ? id : this.state.provincesId,
            cityId: type === 'city' ? undefined : id,
            districtId: undefined,
        }
        if(!value){//用于修改选项
            type === 'city' ? (
                this.setState({
                    city:[],
                    district:[]
                })
            ) : this.setState({
                district:[]
            })
        }
          const obj = {
              [type]: data,
              ...stateData,
          }
          this.setState((preState, props) => ({
              ...obj
          }));
          const output = {
              provincesId: obj.provincesId,
              cityId: obj.cityId,
              districtId: obj.districtId,
          }
          cb(output)
      }
    });
  }

   pushInitValueToArea = (areaArray) => {
      const addItem = [{id:-1,name:"--未选择--"}]
      const outputArea = (addItem.concat(...areaArray)).map((v,i)=>{v.key=i;return v})
      return outputArea;
   }


  render() {
    const { provinces, city, district, defaultProvinces , defaultCity, defaultDistrict } = this.state;
    const selectStyle = this.props.isMini ? { width: 120,marginTop:"10px",flex:1 } : { width: 120,marginTop:"0px" }
    return (
      <div className={this.props.isMini ? "ht-area-select-wrapper-mini" :"ht-area-select-wrapper"}>
        <Select style={selectStyle}
                value={defaultProvinces}
                onChange={ value => this.handleOnChange(value, 'city', provinces.filter(i=>i.id===value)) }>
          {
            provinces.length && this.pushInitValueToArea(provinces).map(item => (
              <Option key={ item.id } value={ item.id }>{ item.name }</Option>
            ))
          }
        </Select>
        <Select 
          style={selectStyle}
          value={defaultCity}
          onChange={ value => this.handleOnChange(value, 'district',city.filter(i=>i.id===value)) }
        >
          {
            city.length && this.pushInitValueToArea(city).map(item => (
              <Option key={ item.id } value={ item.id }>{ item.name }</Option>
            ))
          }
        </Select>
          {this.props.isMini ? <br/> : null}
        <Select style={selectStyle}
                value={defaultDistrict}
                onChange={ value => this.handleOnChange(value, 'others',district.filter(i=>i.id===value)) }>
          {
            district.length && this.pushInitValueToArea(district).map(item => (
              <Option key={ item.id } value={ item.id }>{ item.name }</Option>
            ))
          }
        </Select>
      </div>
    );
  }
}

export default AreaSelect;
