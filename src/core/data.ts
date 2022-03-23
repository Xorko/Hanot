/* Data type definitions for the usage of convert an inkml file (string) into a json object or convert it back
 * `Chan`, `AnnoData`, `TraceGroupData` and `InkData` for internal usage
 * `Data` for usage with xml-parser
 */

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
  trace?: string | string[];
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
  ink: InkData;
}

export type Type = Data;
