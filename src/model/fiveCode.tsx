// services/ImageScraperService.js
import axios from 'axios';

export class FiveCodeInfo {
  constructor(
    public word: string,
    public spell: string,
    public code?: number,
  ) {}
}

export const getFiveCode = async (words: string): Promise<FiveCodeInfo[]> => {
  try {
    var url = `http://144.34.157.61:9090/five/${words}`;
    const response = await axios.get(url);

    var res = JSON.parse(response.data);

    const codes: FiveCodeInfo[] = [];

    return codes;
  } catch (error) {
    console.error('Error get ficeCodes:', error);
    throw error; // 抛出错误以便调用方处理
  }
};
