import React from 'react'
import {Checkbox,Input,Icon} from 'antd'
import {Target} from './target'

const CheckboxGroup = Checkbox.Group;

export const SelectBox= ({
  checkOptions,
  handleChangeTarget,
  handleKeyWordChange,
  targetList,
  keyWord,
  onChange
})=>{
    const element = document.getElementById('search-input-for-index')
    return (
        (
            <div className="select-box">
                <div className="">
                    {/*<Search onChange ={handleKeyWordChange} value ={keyWord} />*/}
                    <Input
                        id="search-input-for-index"
                        placeholder=""
                        value={keyWord}
                        onChange ={handleKeyWordChange}
                        onPressEnter={(e)=>handleKeyWordChange(e,true)}
                    />
                    <Icon style={{position:"relative",left:"-25px",top:"10px"}} type="search" onClick={()=>handleKeyWordChange(element,true)}
                    />
                    <div className="data-checkGroup">
                        <div>
                            <span>筛选</span>
                            <i/>
                        </div>
                        <div className="">
                            <CheckboxGroup options={checkOptions} onChange={onChange} />
                        </div>
                    </div>
                </div>
                <Target handleChangeTarget ={handleChangeTarget} targetList ={targetList} />
            </div>
        )
    )
}
