import React, { Component } from 'react';
const label = {
    output:"导出",
}
export default class OutputSpan extends Component {
    output = () => {
        this.props.onClick()
    }
    render() {
        return (
            <span style={{marginLeft:"20px",textDecoration:"underline",cursor:"pointer"}} onClick={this.output}>{label.output}</span>
        );
    }
}