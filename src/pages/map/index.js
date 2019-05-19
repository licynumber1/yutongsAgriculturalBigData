import  React,{Component } from 'react'
// import './index.less'
import {inject, observer} from "mobx-react/index";
import ShowPartFactory from '../../shared/showPartFactory'
import MapWrapper from './mapWrapper'

@inject('rootStore')
@observer
export default class extends Component{
    render(){
        return (
            <MapWrapper/>
        )
    }
}