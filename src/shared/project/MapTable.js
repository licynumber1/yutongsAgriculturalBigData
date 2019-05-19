import HiddenTable from './HiddenTable'
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}, {
  key: '4',
  name: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park',
}];
export default class extends Component {

  render(){
    const dataList = [
      [{columns,data},{columns,data}],
      [{columns,data}]]
    return (
      dataList.map(
        i => i.map(j=>{
          return (
            <HiddenTable columns={j.columns} dataSource={j.data}/>
          )
        })
      )
    )
  }
}
