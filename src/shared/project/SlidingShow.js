import React, { Component } from 'react';
import { Rate, Popover, Button } from 'antd'
import PopoverSpan from "./PopoverSpan"

const defaultOverflow = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth:"80%",
  display:"inline-block"
};

export default class extends Component {
  constructor(props){
    super(props)
    this.state = {
      positionNum:0,
      unit_identifier:this.props.dataList && this.props.dataList[0] && this.props.dataList[0].unit_identifier,
    }
  }

  getItemWidth = (showNum,width,type) => {
    return type === "num" ? ((width*0.9/showNum)+"").slice(0,4) : ((width*0.9/showNum)+"").slice(0,4)+"px"
  }

  getPosition = (positionNum,oneSize) => {
    return (-positionNum*oneSize+1)+"px"
  }

  prew = () => {
    this.setState({
      positionNum:(this.state.positionNum+1)
    })
  }

  back = () => {
    this.setState({
      positionNum:(this.state.positionNum-1)
    })
  }

  onChangeUnit = (identifier) => {
    this.props.onChangeUnit(identifier)
    this.setState({
      unit_identifier:identifier
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataList.length !== this.props.dataList.length){
      this.props.onChangeUnit(nextProps.dataList[0].unit_identifier)
      this.setState({
        unit_identifier:nextProps.dataList[0].unit_identifier
      })
    }
  }

  render() {
   const { dataList=[{},{},{},{},{},{},{},{}] , showNum=6, jumpNum=1 , width=1304 } = this.props
    return (
      <div style={{height:"90px",padding:"10px"}}>
        <div style={{display:"inline-block",width:"5%", textAlign:"center",lineHeight:"40px"}}>
          <span>
            <Button disabled={this.state.positionNum<=0} onClick={this.back}>{"<"}</Button>
          </span>
        </div>
        <div style={{display:"inline-block",width:"90%",
          overflow:"hidden",position: "relative", top: "10px"}}>
          <div style={{
            width:this.getItemWidth(showNum,width,"num")*(dataList.length)+"px",
            position:"relative",
            transition: "1.3s",
            left:this.getPosition(this.state.positionNum,this.getItemWidth(showNum,width,"num"))
          }}>
            {
              dataList.map((v,i)=>{
                return (
                  <div key={i} onClick={()=>this.onChangeUnit(v.unit_identifier)}
                       style={{display:"inline-block",width:this.getItemWidth(showNum,width),cursor: "pointer"}}>
                    <PopoverSpan data={
                      <span style={  v.unit_identifier === this.state.unit_identifier ? {color:"#1890ff"} : {}}>
                         <span style={
                           {display:"inline-block", borderRadius:"4px",border:"2px solid #1890ff",
                             margin: "0px 5px 5px 0px"}
                         }></span>
                      <span style={defaultOverflow}>{v.unit_name}</span>
                  </span>
                    } popData={ <span>{v.unit_name}</span>}/>
                    <br />
                    <PopoverSpan data={`累计接受需求总数：${v.demand_count || 0}`}/>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div style={{display:"inline-block",width:"5%", textAlign:"center",lineHeight:"40px"}}>
         <span>
          <Button disabled={this.state.positionNum>(dataList.length-showNum-1)} onClick={this.prew}>{">"}</Button>
        </span>
        </div>
      </div>
    )
  }
}
