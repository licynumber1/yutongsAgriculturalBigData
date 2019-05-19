/**
 * powered by 波比小金刚 at 2018-05-28 17:23:28 
 * last modified by 波比小金刚 at 2018-05-28 17:23:28 
 * @Description: Echarts 组件 
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import controller from './controller';
const echarts = require('echarts/lib/echarts');
require("echarts/lib/chart/line");
require("echarts/lib/chart/pie");
require("echarts/lib/chart/bar");
require("echarts/lib/component/legend");
require("echarts/theme/macarons");
require('echarts/map/js/china');

class Charts extends Component {
    
  componentDidMount(){
      if(this.props.data){
          if(this.refDom && this.props.data.total !== 0){
              const myCharts = echarts.init(this.refDom);
              let options = controller.exportOptionConfig(this.props.data);
              if(options){
                  myCharts.setOption(options)
              }
          }
      }
  }

  componentWillReceiveProps(nextProps) {
      if(nextProps.data.total !== 0){
          const myCharts = echarts.init(this.refDom);
          if(this.refDom){
              if(nextProps.data && this.props.widthTag === nextProps.widthTag){//当data存在并宽度未发生变化而刷新
                  let options = controller.exportOptionConfig(nextProps.data);
                  if(options)myCharts.setOption(options,true);
                  //第二个参数用于强制刷新，对于多种图表的情况，echarts会偷懒导致显示不正常，所以要加个true
              }
              else if(this.props.widthTag !== nextProps.widthTag){
                  myCharts.resize();
              }
          }
      }
  }

  render() {
      const { mapHeight } = this.props
    return (
      <div>
          {
              this.props.data.total === 0 ?
                  <div className='echarts-box' style={{textAlign:"center",height:mapHeight ? mapHeight + "px" : "250px", lineHeight:mapHeight ? mapHeight + "px" : "250px"}}>
                      暂无数据!
                  </div> : <div style={{textAlign:"center",height:mapHeight ? mapHeight + "px" : "250px", lineHeight:mapHeight ? mapHeight + "px" : "250px"}} className='echarts-box' ref={e=>this.refDom=e}></div>
          }
      </div>
    );
  }
}

Charts.propTypes = {
  data: PropTypes.object.isRequired
};

export default Charts;
