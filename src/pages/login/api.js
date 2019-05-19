import axios from '../../common/request'

//===============================登录相关=======================================

export async function loginApi(parse) {
  const url = `/login?password=${parse.password}&username=${parse.username}`
  const data = await axios.postJSONWithoutCancel(url, {})
  return data
}

export async function registerApi(parse) {
    let num = ~~(Math.random() * 9999999)
    while(num.length===7){
        num = "0"+num
    }

    let name = ~~(Math.random() * 9999999)
    while(num.length===7){
        name = "0"+name
    }

    const url = `/register?password=${parse.password}&account=${parse.username}&inviteCode=${parse.inviteCode}&phone=1588${num}&name=name${name}&username=${parse.username}`
    const data = await axios.postJSONWithoutCancel(url, {})
    return data
}