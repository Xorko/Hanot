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
  attr: {
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
  traceGroup: TraceGroupData | TraceGroupData[] | undefined;
  trace: string | string[] | undefined;
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

export interface Data {
  ink: InkData;
}
