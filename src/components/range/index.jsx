import React,{Component} from 'react'
import {Select} from 'antd'

const initList = [{
    value:'day',
    label:'天'
},{
    value:'week',
    label:'周'
},{
    value:'month',
    label:'月'
}]

const initValue = initList[0].value
export default class extends Component{
  constructor(props){
    super(props);
    this.state ={
      value:this.props.value || (this.props.listData && this.props.listData[0] && this.props.listData[0].value) || initValue
    }
  }
  handleChange = (e)=>{
      this.setState({
          value:e
      })
      this.props.onChange(e)
  }

  reset = () => {
      this.setState({
          value:(this.props.listData && this.props.listData[0] && this.props.listData[0].value) || initValue
      })
  }

  render(){
    const { listData=initList || [] ,value=initValue,width=120 } = this.props
    return <div style={{margin:"0px 10px 5px 0px"}}>
      <Select
        onChange={this.handleChange}
        style= {{width:width}}
        value={this.state.value}
      >
        {
            listData.map(item=><Select.Option
            key ={item.value}
          >{item.label}</Select.Option>)
        }
      </Select>
    </div>
  }
}

