export const enum Chan {
  X = 'X',
  Y = 'Y',
  F = 'F',
  T = 'T',
}

interface ST_Attributes0 {
  '@_xml:id': string;
  positionInGroundTruthValue?: number;
}

interface ST_Trace {
  attr: ST_Attributes0;
  trace: string | string[];
}

interface ST_TraceGroup {
  attr: ST_Attributes0;
  annotationXML?: ST_AnnoXML;
  traceGroup: ST_Trace | ST_Trace[];
}

interface ST_Attributes1 {
  type: string;
}

interface ST_Attributes2 {
  '#text': string;
  attr: ST_Attributes1;
}

type ST_Anno = ST_Attributes2[];

interface ST_AnnoXML {
  attr: ST_Attributes1;
  annotation: ST_Anno;
}

interface ST_ChanContext {
  name: Chan;
  type: 'decimal' | 'integer';
}

interface ST_Chan {
  attr: ST_ChanContext;
}

type ST_Channels = ST_Chan[];

interface ST_TraceFormat {
  channel: ST_Channels;
}

interface XmlNs {
  '@_xmlns': string;
}

export interface ST_Ink {
  attr: XmlNs;
  traceFormat: ST_TraceFormat;
  annotation: ST_Anno;
  traceGroup: ST_TraceGroup;
}

export interface ST {
  ink: ST_Ink;
}
