import axios from '../../common/request'

//===============================查询=======================================

export async function searchApi(parse) {
  const url = `/env/dimension?staTime=${parse.startDate}&endTime=${parse.endDate}`
  const data = await axios.getWithoutCancel(url, {})
  return data
}