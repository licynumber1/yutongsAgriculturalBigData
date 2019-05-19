import React,{Component} from 'react'
import BasePage from '../../components/MutilPage/index'
import './index.less'
import { Link } from 'react-router-dom';
import logo from '../../assets/icons/fishsaying.png';
import GetWrapperWidth from "../../shared/getWrapperWidth";

export default class extends Component{
  render(){
    return (
        <div>
            <div className="logo" key="logo">
                <Link to="/">
                    <span style={{margin:"0 auto",display:"inline-block",width:"190px",height:"60px",background:`no-repeat left url(${logo})`,}}></span>
                </Link>
            </div>
            <GetWrapperWidth>
                <div className='share-charts'>
                    <BasePage pageType="share"/>
                </div>
            </GetWrapperWidth>
        </div>
    )
  }
}

