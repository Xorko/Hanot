/* Data type definitions for the usage of convert an inkml file (string) into a json object or convert it back
 * `XML`, `XMLattr`, Chan`, `AnnoData`, `TraceGroupData` and `InkData` for internal usage
 * `Data` for usage with xml-parser
 */

export interface XML {
  attr: XMLAttr;
}

export interface XMLAttr {
  version: number;
  encoding: string;
}

export const enum Chan {
  X = 'X',
  Y = 'Y',
  F = 'F',
  T = 'T',
}

export interface AnnoData {
  '#text': string;
  attr: { type: string };
}

export interface TraceData {
  '#text': string;
  attr: { oldTrace: string };
}

export interface TraceGroupData {
  attr?: {
    'xml:id'?: string;
    noise?: string;
    positionInGroundTruthValue?: number;
    [key: string]: any;
  };
  annotationXML?: {
    attr: { type: string };
    annotation: AnnoData[];
  };
  annotation?: AnnoData[];
  traceGroup?: TraceGroupData | TraceGroupData[];
  trace?: string | TraceData | (string | TraceData)[];
}

export interface InkData {
  attr: {
    xmlns: string;
  };
  traceFormat: {
    channel: {
      attr: {
        name: Chan;
        type: 'decimal' | 'integer';
      };
    }[];
  };
  annotation?: AnnoData[];
  traceGroup: TraceGroupData | TraceGroupData[];
}

interface Data {
  '?xml'?: XML;
  ink: InkData;
}

export type Type = Data;
