/**
 * powered by 波比小金刚 at 2018-05-28 11:18:56 
 * last modified by 波比小金刚 at 2018-05-28 11:18:56 
 * @Description: Echarts Controller
*/
import { logger, entries, toThousands } from '../../utils/utils';

// ? 核心 Controller 类
// color configs
const baseColorLise = [
    '#52dbfd','#a9d573','#ee7169','#f7d254','#fd9a52','#eb7b96','#af84df','#7987cb','#92a6ff',
    '#63ddae','#f9ee30','#cea975','#bdbabd','93a4ac'
]
const barColor = baseColorLise
const lineColor = baseColorLise
const pieColorList = baseColorLise
const getpieColorList2 = (num) => {//返回后面的长度
    return baseColorLise.slice(num)
}

const fixHugeData = (v) => {
    if(v>10000){
        return v/10000 + "万"
    }
    return v
}

const fixHugeLabel = (v) => {
    const size = 4
    if(v.length > size){
        return v.slice(0,size)+"..."
    }
    return v
}

const getPieFormatter = ()=>{
    return("{b}:{c}")
}

const getMapTitle = (title) => {
    const {maxNum,currentNum} = title
    return ({
        left: 'center',
        text: `{a|${toThousands(currentNum)}}\n{b|历史最高:${toThousands(maxNum)}}`,
        textStyle: {
            color: '#eee',
            fontSize:"20",
            rich: {
                a: {
                    fontSize:20,
                    lineHeight: 30,
                    color:"#2dc3e8",
                    fontWeight:"600"
                },
                b: {
                    fontSize:16,
                    lineHeight: 26,
                    color:"#333333",
                }
            }
        },
        top:40,
        left:40,
    })
}

class Controller {

  @logger('导出option配置')
  exportOptionConfig(data){
    if(data && data.type){
      let options;
      switch(data.type){
        case 'lines':
          options = this.getLineChartsOption(data.itemDataList);
          break;
        case 'pie':
          options = this.getPieChartsOption(data.itemDataList);
          break;
        case 'pies':
            options = this.getPiesChartsOption(data.itemDataList);
          break;
        case 'bar':
          options = this.getBarChartsOption(data.itemDataList);
          break;
        case 'userMap':
            options = this.getUserMapChartsOption(data.itemDataList,data.title);
            break;
        case 'map':
            options = this.getMapChartsOption(data.itemDataList);
            break;
        default:
          options = null;
      }
      return options;
    }
  }

    @logger('处理地图option')
    getUserMapChartsOption(data1,title){
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
        const baseData = data1.map((i,key)=>({name:i.name+key,value:20,isBlink:i.isBlink}));
        var fixData = []
        baseData.forEach(i=>{
            const flag = fixData.findIndex(j=>i.name===j.name)
            if( flag!== -1){
                fixData[flag].value += i.value
            }else{
                fixData.push(i)
            }
        })
        var data = fixData;
        const geoData = {}
        data1.forEach((i,key)=>{
            geoData[i.name+key] = i.geo
        })
        var geoCoordMap = geoData;
        if(data.length){
            const datas = data[0]['datas'];
            if(true || datas){
                return {
                    title:getMapTitle(title),
                    backgroundColor: '#ffffff',
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a}:{b}"
                    },
                    geo: {
                        map: 'china',
                        zoom:1.2,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#ebeff2',
                                borderColor: '#2dc3e8'
                            },
                            emphasis: {
                                areaColor: '#dbe5ed'
                            }
                        }
                    },
                    series : [
                        {
                            name: '访问人所在地',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(data),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    shadowBlur: 2,
                                    shadowColor: 'rgba(45, 195, 232, 0.8)',
                                    color: 'rgba(14, 241, 242, 0.8)'
                                }
                            }
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertData(data.filter(i=>i.isBlink === true)),
                            symbolSize: function (val) {
                                return val[2] / 7;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#2dc3e8',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                };
            }
        }
    }

    @logger('处理地图option')
    getMapChartsOption(data1){
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
        const baseData = data1.map((i,key)=>({name:i.name+key,value:20,isBlink:i.isBlink}));
        var fixData = []
        baseData.forEach(i=>{
            const flag = fixData.findIndex(j=>i.name===j.name)
            if( flag!== -1){
                fixData[flag].value += i.value
            }else{
                fixData.push(i)
            }
        })
        var data = fixData;
        const geoData = {}
        data1.forEach((i,key)=>{
            geoData[i.name+key] = i.geo
        })
        var geoCoordMap = geoData;
        if(data.length){
            const datas = data[0]['datas'];
            if(true || datas){
                return {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a}"
                    },
                    legend: {
                        orient: 'vertical',
                        y: 'bottom',
                        x:'right',
                        data:['访问人所在地'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: 'rgba(48,56,69,0.8)',//地图默认的背景颜色
                                borderColor: '#a6c84c'//地图默认的边线颜色
                            },
                            emphasis: {
                                areaColor: '#a6c84c'//地图触发地区的背景颜色
                            }
                        }
                    },
                    series : [
                        {
                            name: '访问人所在地',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertData(data),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#a6c84c'
                                }
                            }
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertData(data.filter(i=>i.isBlink === true)),
                            symbolSize: function (val) {
                                return val[2] / 10;
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#a6c84c',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                };
            }
        }
    }
  
  @logger('处理折线图option')
  getLineChartsOption(data){
    if(data.length){
      const datas = data[0]['datas'];
      if(datas){
        return {
          title : {
            text: `${data[0].label || ""}变化趋势图`,
            subtext: '数据来自双阳大田气象数据站',
            x: 'center',
            align: 'right'
          },
          color:lineColor,
          tooltip: {
            trigger: 'axis'
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 70,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 70,
              end: 100,
            }
          ],
            grid: {
                left: '3%',
                right: '40',
                bottom: '1%',
                containLabel: true
            },
            legend: {
            data: data.map(item => item.label || item.date),
            right:0,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.getAllKeysValuesFromMap(datas)[0]
          },
          yAxis: {
              splitLine:{
                  lineStyle:{
                      color:"#f6f6f6",
                  },
              },
            type: 'value',
            axisLabel:{
                formatter:fixHugeData
            }
          },
          series: data.map(item => ({
            name: item.label || item.date,
            type: 'line',
            data: this.getAllKeysValuesFromMap(item.datas)[1],
            smooth: true,
          }))
        }
      }
    }
  }

    @logger('处理柱状图图option')
    getBarChartsOption(data){
        if(data.length){
            const datas = data[0]['datas'];
            if(datas){
                return {
                    color: barColor,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                  dataZoom: [
                    {
                      show: true,
                      realtime: true,
                      start: 70,
                      end: 100
                    },
                    {
                      type: 'inside',
                      realtime: true,
                      start: 70,
                      end: 100
                    }
                  ],
                    // legend: {
                    //     data: datas.map(item => item.label)
                    // },
                    xAxis: {
                      type: 'category',
                      data: this.getAllLabelFromMap(datas)[0],
                      axisLabel:{
                        formatter:fixHugeLabel
                      },
                    },
                    yAxis: {
                      type: 'value',
                      boundaryGap: [0, 0.01],
                      data: this.getAllKeysValuesFromMap(datas)[0],
                      axisLabel:{
                        formatter:fixHugeData
                      },
                    },
                    series: data.map(item => ({
                        name: item.label || item.date,
                        type: 'bar',
                        barWidth: '60%',
                        data: this.getAllKeysValuesFromMap(item.datas)[1]
                    }))
                }
            }
        }
    }

  @logger('处理饼图option')
  getPieChartsOption(data){//todo:现在只支持一个饼图的展示~
      if(data){
          const pieData = data.map(i=>{
              return {
                  value:i.value,
                  name:i.label || i.date,
              }
          })
          const singlePieConfig = {
              color:pieColorList,
              title : {
                  text: '',
                  subtext: '',
                  x:'center'
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  top:30,
              },
              tooltip: {
                  trigger: 'item',
                  formatter: "{b}:{c}"
              },
              series : [
                  {
                      name: '',
                      type: 'pie',
                      radius: ['37%', '50%'],
                      center: ['50%', '60%'],
                      label: {
                          normal: {
                              show: false,
                              formatter: getPieFormatter
                          },
                          emphasis: {
                              show: false
                          }
                      },
                      data:pieData,
                  },
              ]
          }
          return singlePieConfig
      }
  }

    getPiesChartsOption(data){//todo:现在只支持一个饼图的展示~，后续添加多个饼图
        if(data.length){
            const datas = data[0]['datas'];
            if(datas){
                let pieData = []
                for(let [key, value] of entries(datas)){
                    pieData.push({
                        value:value,
                        name:key,
                    })
                }
                const singlePieConfig = {
                    color:pieColorList,
                    title : {
                        text: '',
                        subtext: '',
                        x:'center'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}:{c}"
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['37%', '50%'],
                            center: ['50%', '60%'],
                            label: {
                                normal: {
                                    show: false,
                                    formatter: getPieFormatter
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data:pieData,
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        return pieColorList[params.dataIndex]
                                    }
                                },
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                    ]
                }
                const pieConfig =  data.length === 2 ? this.getMultiPieChartsOption(singlePieConfig,data) : singlePieConfig;
                return pieConfig
            }
        }
    }

    @logger('处理多饼图option')
    getMultiPieChartsOption(singlePieConfig,data){
        const datas = data[1]['datas'];
        let config = singlePieConfig
        let pieData = []
        for(let [key, value] of entries(datas)){
            pieData.push({
                value:value,
                name:key,
            })
        }
        const MultiPieConfig = {
                color:getpieColorList2(config.series[0].data.length),
                name: '',
                type: 'pie',
                radius: ['0%', '25%'],
                center: ['50%', '60%'],
                label: {
                    normal: {
                        show: false,
                        formatter: getPieFormatter
                    },
                    emphasis: {
                        show: false
                    }
                },
                data:pieData,
            }
        config.series.push(MultiPieConfig)
      return config
    }

  getAllKeysValuesFromMap(data){
    let keys = [], values = [];
    for(let [key, value] of entries(data)){
      keys.push(key);
      values.push(value);
    }
    return [keys, values];
  }

    getAllLabelFromMap(data){
        let keys = [], values = [];
        for(let [key, value] of entries(data)){
            keys.push(key);
            values.push(value);
        }
        return [keys, values];
    }

}

export default new Controller();




