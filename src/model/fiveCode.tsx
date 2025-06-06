// services/ImageScraperService.js
import axios from 'axios';
import {Result} from './Result'
export class FiveCodeInfo {
  constructor(
    public word: string,
    public spell: string,
    public code?: number,
  ) {}
}

export const getFiveCode = async (words: string): Promise<Result> => {
  try {
    var url = `http://144.34.157.61:9090/five/${words}`;
    const response = await axios.get(url);
    if (response.status != 200) {
      return new Result(-1,response.statusText,null)      
    }
    // const res = JSON.parse(response.data);
    var result = new Result(response.data.code,response.data.msg,null)
    if (result.code != 0) {
      return result
    }
    const codes: FiveCodeInfo[] = [];
    const data = response.data.data
    console.log('~~~~~~~~~~~~~~~~~~')
    console.log(data)
    for(const item of data) {
       const code = new FiveCodeInfo(item.word,item.spell,item.code)
        codes.push(code)
    }
    result.data = codes;
    return result;
  } catch (error) {
    console.error('Error get ficeCodes:', error);
    throw error; // 抛出错误以便调用方处理
  }
};
