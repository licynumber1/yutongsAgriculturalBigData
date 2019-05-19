import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.less'

moment.locale('zh-cn')

const { RangePicker } = DatePicker

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // time:this.props.time || [null,null]
    }
  }
  handleChange = moment => {
      const sortMoment = moment.map(i=>i).sort((i,j)=>{
          return !i.isBefore(j)
      })
      return this.props.change(sortMoment)
  }
    disabledDate = current => {
        return current && current > moment().endOf('day');
    }
  render() {
    const { showTime, size, style = {} } = this.props
    const { time } = this.props
    const value = time.map(item => (item === '' ? null : moment(item)))
    return (
        <span>
            {
                this.props.isMobile ?
                    <span>
                        <DatePicker  disabledDate={this.disabledDate}
                                     showTime={showTime}
                                     size={size || 'default'}
                                     placeholder={'开始时间'}
                                     format="YYYY-MM-DD"
                                     value={value[0]}
                                     style={{ ...style }}
                                     onChange={(data)=>this.handleChange([data,value[1]])}
                        />
                        <DatePicker disabledDate={this.disabledDate}
                                    showTime={showTime}
                                    size={size || 'default'}
                                    placeholder={'结束时间'}
                                    format="YYYY-MM-DD"
                                    value={value[1]}
                                    style={{ ...style }}
                                    onChange={(data)=>this.handleChange([value[0],data])}
                        />
                    </span> :
                    <RangePicker
                        disabledDate={this.disabledDate}
                        className ="data_datePicker"
                        showTime={showTime}
                        size={size || 'default'}
                        format="YYYY-MM-DD"
                        placeholder={['开始时间', '结束时间']}
                        value={value}
                        style={{ ...style }}
                        onChange={this.handleChange}
                    />
            }
        </span>
    )
  }
}
