import React,{Component} from 'react'
import GetDataConfigWrapper from './getDataConfigWrapper'
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react/index";
import './renderDragactArray.less'
import DragactPart from "../shared/dragactPart"
import {deepCompare} from "../utils/utils";

@inject('rootStore')
@observer
class RenderDragactArray extends Component{
    constructor(props){
        super(props)
        this.state = {
            curMoveItem:0,
        }
    }

    getFormData = () => {
        return this.props.getFormData()
    }

    fixArrayToTwoDimensionalArray = (singleArr,perData) => {//数组二维化,每perData为一个数组的数量
        const { editorModal=false } = this.props.rootStore.uiStore.modalList;
        let mapArr = []
        if(editorModal){
            mapArr = singleArr.concat(undefined)
            //mapArr = singleArr.concat(undefined)
        }else{
            mapArr = singleArr
        }
        //如果编辑状态，多增加一项用于添加数据项
        return mapArr
        // mapArr = (mapArr.length ? mapArr : mapArr.searchItemIDList) || [] //对于数据格式不同的情况，分别进行处理
        // let dimensionalArray = (new Array(Math.ceil(mapArr.length/perData))).fill(0).map(i=>[])
        // mapArr.forEach((v,i)=>{
        //     const tar = Math.floor(i/perData)
        //     dimensionalArray[tar].push(v)
        // })
        // return dimensionalArray
    }

    renderDragactArray = (dimensionalArray,perData,spacing) => {//渲染该二维数组为图表
        const width = (100-spacing*2) / perData + "%"
        return (
            <div className="search-data-list">
                <DragactPart data = {dimensionalArray}
                             changeState={this.props.changeState}
                             width={width}
                             id={this.props.id}
                             searchData={this.getFormData()}
                             getBoardById={this.props.getBoardById}
                             pageType={this.props.pageType}
                             outterTitle={this.props.outterTitle}
                             full={this.props.full}
                />
            </div>
        )
    }

    render(){
        const { data,perData=3, spacing=1 } = this.props
        const dimensionalArray = this.fixArrayToTwoDimensionalArray(data,perData)
        return (<div>
            {
                this.renderDragactArray(dimensionalArray,perData,spacing)
            }
        </div>)
    }
}

RenderDragactArray.propTypes = {
    data: PropTypes.array.isRequired
};

export default RenderDragactArray