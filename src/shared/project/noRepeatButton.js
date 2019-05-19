import React, {Component} from 'react';
import { Button } from 'antd'

export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            disable:false
        }
    }
    onClick = (time,onClick) => {
        this.disableAdd(time)
        onClick()
    }

    disableAdd = (time) => {
        this.setState({
            disable:true,
        })
        this.timeout = setTimeout(()=>this.changeDisable(false),time)
    }

    changeDisable = (v) => {
        this.setState({
            disable:v!==undefined ? v : !this.state.disable
        })
    }

    render() {
        const { time=2000,onClick,...other } = this.props
        return (
            <Button onClick={()=>this.onClick(time,onClick)} {...other} disabled={this.state.disable}></Button>
        )
    }

    componentWillUnmount(){
        clearTimeout(this.timeout)
    }
}