import  React,{Component } from 'react'
import IndexDistributor from '../../components/IndexDistributor'

export default class extends Component{
    render(){
        return (
           <IndexDistributor type={this.props.type}/>
        )
    }
}