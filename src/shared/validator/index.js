import { message } from 'antd'

export const requireValidator = ({value},msg) => {
    const cutValue = value.replace(/(^\s*)|(\s*$)/g, "");
    if(value === undefined || value === "" || value === null || cutValue === ""){
        message.error(msg);
        return false;
    }
    return true
}

export const lengthValidator = ({value,max=10,min=1},msg) => {
   if(value && value.length && value.length <= max && value.length >= min){
       return true
   }else{
       message.error(msg);
       return false;
   }
}

export const range = ({value,min=0,max=0}) => {
    if(typeof value === 'number'){
        if(value>=min && value<=max){
            return true
        }else{
            message.error(`不在给定范围[${min},${max}]内`);
            return false
        }
    }else{
        message.error(`传入不是数字`);
        return false
    }
}

export const validator = {
    requireValidator,
    lengthValidator,
}
