const xml_js_options = {
  attributeNamePrefix : "",
  attrNodeName: "attr", //default is 'false'
  textNodeName : "#text",
  ignoreAttributes : false,
  ignoreNameSpace : false,
  allowBooleanAttributes : false,
  parseNodeValue : true,
  parseAttributeValue : true,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  parseTrueNumberOnly: false,
  numParseOptions:{
    hex: true,
    leadingZeros: true,
    //skipLike: /\+[0-9]{10}/
  },
  arrayMode: false, //"strict"
  stopNodes: ["parse-me-as-string"],
  alwaysCreateTextNode: false
};

const js_xml_options = {
  attributeNamePrefix: "",
  attrNodeName: "attr", //default is false
  textNodeName: "#text",
  ignoreAttributes: false,
  cdataTagName: "__cdata", //default is false
  cdataPositionChar: "\\c",
  format: true,
  indentBy: "  ",
  supressEmptyNode: true,
  rootNodeName: "element"
};

export {js_xml_options, xml_js_options};

