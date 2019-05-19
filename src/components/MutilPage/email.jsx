import React,{Component} from 'react';
import {Select,Input,Checkbox,Button} from 'antd'

const emails = [
    'a',
    'b',
    'c'
]

const perDate = [
    {value:"day",label:"每天"},
    {value:"week",label:"每周"},
    {value:"month",label:"每月"},
]

const time = new Array(24).fill(0).map((v,i)=>{ return {value:i+"",label:i+":00"} } )

const weekDays = [
    {value:"1",label:"一"},
    {value:"2",label:"二"},
    {value:"3",label:"三"},
    {value:"4",label:"四"},
    {value:"5",label:"五"},
    {value:"6",label:"六"},
    {value:"7",label:"七"},
].map(v=>{v.label="星期"+v.label; return v})

const monthDays =  new Array(31).fill(0).map((v,i)=>{ return {value:(i+1)+"",label:(i+1)+"日"} } )

export default class extends Component{
  constructor(props){
    super(props)
      this.state = {
          perDate:perDate[0].value,
          time:time[0].value,
          weekDays,
          monthDays,
          email:"",
          emailTitle:"",
          emailText:"",
          receiver:"",
          pdf:false,
      }
  }
  handlePerDateChange = (data) => {
      const isWeekConfig = data === "week"
      const isMonthConfig = data === "month"
      let otherState = {}
      if(isWeekConfig){
          otherState.weekDays = weekDays[0].value
      }
      if(isMonthConfig){
          otherState.monthDays = monthDays[0].value
      }
      this.setState({
          ...otherState,
          perDate:data
      })
  }
    handleMonthDaysChange = (data) => {
        this.handleNormalChange('monthDays',data)
    }

    handleWeekDaysChange = (data) => {
        this.handleNormalChange('weekDays',data)
    }


    handleTimeChange = (data) => {
        this.handleNormalChange('time',data)
    }

    handleNormalChange = (key,value) => {
        this.setState({
            [key]:value
        })
    }

  handleEmailChange = (data)=>{
      this.handleNormalChange('email',data)
  }

  handleReceiverChange = (e) => {
      this.handleNormalChange('receiver',e.target.value)
  }
  handleChangePDF = (e)=>{
      this.handleNormalChange('pdf',e.target.checked)
  }
  handleEmailTitleChange = (e) => {
      this.handleNormalChange('emailTitle',e.target.checked)
  }
  handleEmailTextChange = (data) => {
      this.handleNormalChange('emailText',data)
  }
  handleCancel = ()=>{
      this.props.onCancel('emailModal');
  }
  handleClick = () => {
    const { weekDay,monthDays,...sendData } = this.state
  }
  render(){
    const isWeekConfig = this.state.perDate === "week"
    const isMonthConfig = this.state.perDate === "month"
    return <div className="email-content">
      <h3>邮件发送设置</h3>
      <div>
        <p>选择发件邮箱</p>
        <Select
          onChange={this.handleEmailChange}
          style ={{width:'100%'}}
          value={this.state.email}
        >
          {
            emails.map(item=><Select.Option
              key ={item}
            >{item}</Select.Option>)
          }
        </Select>
      </div>
      <div>
        <p>收件人</p>
        <Input.TextArea onChange={this.handleReceiverChange}/>
        <label className="tips">多个邮箱之间用英文逗号分隔</label>
      </div>
      <div>
        <p>发件时间</p>
        <span className="time-select">
        <Select
          onChange={this.handlePerDateChange}
          style ={{width:'80px'}}
          value={this.state.perDate}
        >
          {
              perDate.map(item=><Select.Option
              key ={item.value}
            >{item.label}</Select.Option>)
          }
        </Select>
        <Select
          onChange={this.handleTimeChange}
          style ={{width:'80px',margin:'0 10px'}}
          value={this.state.time}
        >
           {
               time.map(item=><Select.Option
                   key ={item.value}
               >{item.label}</Select.Option>)
           }
        </Select>
            {
                isWeekConfig ?
                  <Select
                      onChange={this.handleWeekDaysChange}
                      style ={{width:'80px'}}
                      value={this.state.weekDays || weekDays[0].value}
                  >
                      {
                          weekDays.map(item=><Select.Option
                              key ={item.value}
                          >{item.label}</Select.Option>)
                      }
                  </Select> : null
            }
            {
                isMonthConfig ?
                    <Select
                        onChange={this.handleMonthDaysChange}
                        style ={{width:'80px'}}
                        value ={this.state.monthDays}
                    >
                        {
                            monthDays.map(item=><Select.Option
                                key ={item.value}
                            >{item.label}</Select.Option>)
                        }
                    </Select> : null
            }
        </span>
      </div>
      <div>
        <p>邮件标题</p>
        <Input onChange={this.handleEmailTitleChange}/>
      </div>
      <div>
        <p>邮件正文</p>
        <Input.TextArea onChange={this.handleEmailTextChange}/>
      </div>
      <Checkbox onChange={this.handleChangePDF}>作为PDF附件发送</Checkbox>
      <div className="btn-list">
        <Button onClick ={this.handleCancel}>取消</Button>
        <Button onClick={this.handleClick} type="primary">确定</Button>
      </div>
    </div>
  }
}