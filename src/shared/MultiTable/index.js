import React, { Component } from 'react';
import { Select } from 'antd'
import PropTypes from 'prop-types';
import HiddenTable from '../../shared/project/HiddenTable'
import './index.less'
import {message} from "antd/lib/index";
import axios from "../../common/request";
import download from '../../shared/project/download'
import OutputSpan from './outputSpan'

//-----------------------------------------------------------------------------------------------
//  　　　　　　　　　　　　des:用于创建多功能列表
//-----------------------------------------------------------------------------------------------
const componentName = 'multiTable'
class MultiTable extends Component {

    constructor(props){
        super(props)
        this.state = {
            pageSize:this.props.pageSize || 20,
            current: 1,
        }
    }

    output = () => {
        const data = this.props.outputData.map(i=>{
            const outData = []
            for(let j of this.props.columns){
                outData.push(i[j.dataIndex])
            }
            return outData
        })
        const urlArr = window.location.href.split('/')
        const id = urlArr[urlArr.length - 1]
        let dataString = ""
      let length = data.length
        data.forEach((i,index)=>{
            if(length-1 === index){
              dataString+= i
            }else{
              dataString+= i + ","
            }
        })
        const parse = {
            data:dataString,
            headtext: this.props.columns.map(i=>i.title),
            //itemId:id,
        }
        console.log(parse)
        // axios.postJSON(`fs/base/data/share/excel/`, parse).then(res=>{
        //     if(res && res.data && res.data.code === 200 && res.data.result){
        //         //message.success(res.data.result)
        //         download(res.data.result)
        //     }else{
        //         message.error( (res && res.data && res.data.msg) || '下载excel失败');
        //     }
        // })
    }

    changePageSize = (e) => {
        const data = {
            pageSize:e,
            current:1,
        }
        this.setState({
            ...data
        })
        this.props.onChange(data)
    }

    changePage = (e) => {
        this.setState({
            current:e.current
        })
        const data = {
            current:e.current,
            pageSize:this.state.pageSize,
        }
        this.props.onChange(data)
    }

    getTotalDataSource = (dataSource,total) => {
        let pieFlag = false
        if(dataSource && dataSource[0] && dataSource[0].datas){
            pieFlag = true
        }
        let totalItem = {
            date:"本页总计/全部总计",
        }
        if(dataSource.length === 0){
            return dataSource
        }else{
            dataSource.forEach(i=>{
                for( let j in i){
                    if(j!=='date'){
                        totalItem[j] = totalItem[j] === undefined ? i[j] : totalItem[j]+i[j]
                    }
                }
            })
            const array = this.props.realOutputData || []
            let newTotalItem = totalItem
            for(let i in totalItem){
                const itemArray = (array.filter(j=>((j.label===i || j.date===i) || pieFlag)))
                let totalNumber = (itemArray && itemArray[0] && itemArray[0].total!==undefined) ? itemArray[0].total : 0
                if(i!=="date"){
                    if(pieFlag){//单个图表数据不同
                        totalNumber = itemArray.map(i=>(i.value || 0)).reduce((a=0,b=0)=>{
                            return (a+b)
                        },0)
                    }
                    totalItem[i] = totalItem[i] + `/${totalNumber}`
                }
            }
            return dataSource.concat(newTotalItem)
        }
    }

    getPageSize = () => {
        return (~~this.state.pageSize)+1 || '21'
    }

    render() {
        const initData = {
            getAllConfigs:[{value:"20",label:"20"},{value:"40",label:"40"},{value:"60",label:"60"}]
        }
        const { columns, dataSource, total, configs, style={}, withTotal=true } = this.props
        const options = (configs && configs.configsgetAllConfigs) || initData.getAllConfigs
        return (
            <div className={`${componentName}-wrapper`} style={{visibility:this.props.visibility}}>
                <HiddenTable style={style} columns={columns} dataSource={ withTotal ? this.getTotalDataSource(dataSource,total) : dataSource }
                       pagination={
                           {
                               total:total,
                               pageSize:this.getPageSize(),
                               current: this.state.current,
                           }
                       }
                       onChange={this.changePage}/>
                <div className={`${componentName}-pageSize-select`}>
                    <Select onChange={this.changePageSize}
                            style ={{width:'80px'}}
                            defaultValue ={options[0].value}
                    >
                        {
                            options.length && options.map((item,index) => (
                                <Select.Option key={ index } value={ item.value }>{ item.label }</Select.Option>
                            ))
                        }
                    </Select>
                    <OutputSpan onClick={this.output}/>
                </div>
            </div>

        );
    }
}

MultiTable.propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    total:PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MultiTable;