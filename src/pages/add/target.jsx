import React from 'react'
export const Target = ({
  targetList,
  handleChangeTarget
})=>(<div className="target-list">
    {
        targetList && targetList.length === 0 ?
            <div style={{height:"100%",textAlign:"center",lineHeight:"350px"}}>
              <span>暂无数据</span>
            </div>
            : null
    }
  {
    targetList.map((item,index)=><div key ={index} className="target-top-item">
      {item.name !=="" ? <h3>{item.name}</h3> : null}
      <div className="target-secend-list">
        {
          item.secendTitles && item.secendTitles.map((item,index)=><div key ={index} className="target-secend-item">
            {item.name !=="" ? <p>{item.name}</p> : null}
            <div className="target-third-list">
              {
                item.thirdTitles && item.thirdTitles.map((item,index)=><div key ={index} className="target-third-item">
                  {item.name !=="" ? <p>{item.name}</p> : null}
                  <div className="target-titles-item">
                    {
                      item.titles && item.titles.map((item,index)=><span key ={index} className="target-item-title" onClick ={handleChangeTarget.bind(null,item)}>{item.name}</span>)
                    }
                  </div>
                </div>)
              }
            </div>
          </div>)
        }
      </div>
    </div>)
  }
</div>)