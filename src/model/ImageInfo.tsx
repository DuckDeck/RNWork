// services/ImageScraperService.js
import axios from 'axios';
// 注意：在 React Native 中，为了减小打包体积，通常导入 cheerio 的 slim 版本
const cheerio = require('react-native-cheerio');
import iconv from 'iconv-lite'; // 导入 iconv-lite
import {Buffer} from 'buffer';
export class ImageInfo {
  constructor(
    public title: string, // 图片的alt属性或从其他标签中提取的标题
    public url: string, // 图片的src属性
    public width?: number, // 如果HTML中有，可以提取
    public height?: number, // 如果HTML中有，可以提取
    public subUrl?: string,
  ) {}
}
const baseUrl = 'https://pic.netbian.com/';
export const get4Kimages = async (subUrl: string): Promise<ImageInfo[]> => {
  try {
    var url = subUrl;
    if (!url.startsWith('http')) {
      url = baseUrl + subUrl;
    }
    const response = await axios.get(baseUrl + subUrl, {
      responseType: 'arraybuffer', // 告诉 axios 返回原始字节数据，而不是自动解析为字符串
    });

    // 尝试从响应头或HTML meta标签中获取编码
    let charset = 'utf-8'; // 默认 UTF-8
    const contentType = response.headers['content-type'];
    console.log(contentType);
    // 1. 从 Content-Type 头中提取 charset
    if (contentType && contentType.includes('charset=')) {
      const match = contentType.match(/charset=([^;]+)/);
      if (match && match[1]) {
        charset = match[1].toLowerCase().replace(/-/g, ''); // 统一格式，例如 'gb2312'
      }
    }
    // 2. 将原始字节数据解码为字符串
    // 使用 iconv-lite 进行解码
    let htmlContent = iconv.decode(Buffer.from(response.data), charset);

    // 3. (可选但推荐) 再次尝试从 HTML 内部的 meta 标签中检测编码
    // 如果 Content-Type 头缺失或不准确，HTML 内部的 meta 标签更可靠
    const metaCharsetMatch = htmlContent.match(
      /<meta\s+[^>]*charset=["']?([^"'>\s]+)["']?[^>]*>/i,
    );
    if (metaCharsetMatch && metaCharsetMatch[1]) {
      const metaCharset = metaCharsetMatch[1].toLowerCase().replace(/-/g, '');
      if (metaCharset !== charset && iconv.encodingExists(metaCharset)) {
        // 如果 meta 标签检测到的编码不同且有效，重新解码
        console.log(
          `Detected different charset in meta tag: ${metaCharset}. Re-decoding.`,
        );
        charset = metaCharset;
        htmlContent = iconv.decode(Buffer.from(response.data), charset);
      }
    }
    const $ = cheerio.load(htmlContent);

    const images: ImageInfo[] = [];

    $('div.slist li img').each((index, element) => {
      const img = $(element);
      const src = img.attr('src');
      const alt = img.attr('alt');
      const nextUrl = img.parent('a').attr('href');
      let fullImageUrl = src;
      if (src && !src.startsWith('http')) {
        fullImageUrl = `${baseUrl}${src}`; // 拼接为完整URL
      }

      if (fullImageUrl && alt) {
        console.log('打印标题');
        console.log(alt);
        images.push(new ImageInfo(alt, fullImageUrl, 0, 0, nextUrl));
      }
    });
    console.log('Parsed Image Models:', images.length);

    return images;
  } catch (error) {
    console.error('Error fetching or parsing images:', error);
    throw error; // 抛出错误以便调用方处理
  }
};
