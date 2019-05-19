import React, { Component } from 'react';
import { Select, Popover, Icon } from 'antd'
import moment from "moment/moment";

export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            time: props.time ? moment(props.time) : undefined,
            oldTime: props.time ? moment(props.time) : undefined
        }
        this.timer = setInterval(this.timeAdd,1000)
    }

    timeAdd = () => {
        if(this.state.time){
            let newTime = moment(this.state.time).add(1, 'seconds')
            this.setState({
                time:newTime
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.oldTime !== nextProps.time){
            this.setState({
                time:nextProps.time,
                oldTime:nextProps.time,
            })
        }
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    render() {
        return (
           <span>
               <Icon type="clock-circle-o" style={{marginRight:'10px'}}/>
               {this.state.time ? moment(this.state.time).format("hh:mm:ss") : "暂无时间"}
           </span>
        )
    }
}