import React, { Component } from 'react';
import {inject, observer} from "mobx-react/index";

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:用于为获取界面大小为echarts提供rerender标识
//-----------------------------------------------------------------------------------------------
@inject('rootStore')
@observer
class getWrapperWidth extends Component {
    componentDidMount(){//监听resize事件
        const {uiStore: {changeWidthTag}} = this.props.rootStore;
        window.onresize = function () {
            changeWidthTag()
        }
    }
    render() {
        return (
           <div id="width-tag" style={{width:"100%"}}>
               {this.props.children}
           </div>
        );
    }

}

export default getWrapperWidth;