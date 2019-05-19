import React, { Component } from 'react';
import { Select, Popover } from 'antd'
import styles from './style.less';

export default class extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <Popover {...this.props} overlayClassName={styles.helpPopover} content={
        <span>
          {
            this.props.content.map((v,i)=>{
              return (<p key={i} className={styles.indent}>{v}</p>)
            })
          }
        </span>
      }>
        <a className={styles.icon}>?</a>
      </Popover>
    )
  }
}
