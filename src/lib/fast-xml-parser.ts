import { XMLBuilder, XMLParser } from 'fast-xml-parser';

const xmlToJsOptions = {
  attributeNamePrefix: '',
  attributesGroupName: 'attr', //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  numParseOptions: {
    hex: true,
    leadingZeros: true,
    //skipLike: /\+[0-9]{10}/
  },
  arrayMode: false, //"strict"
  stopNodes: ['parse-me-as-string'],
  alwaysCreateTextNode: false,
};

const jsToXmlOptions = {
  attributeNamePrefix: '',
  attributesGroupName: 'attr', //default is false
  textNodeName: '#text',
  ignoreAttributes: false,
  cdataTagName: '__cdata', //default is false
  cdataPositionChar: '\\c',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
  rootNodeName: 'element',
};

const parser = new XMLParser(xmlToJsOptions);

const builder = new XMLBuilder(jsToXmlOptions);

export { parser, builder, xmlToJsOptions, jsToXmlOptions };
