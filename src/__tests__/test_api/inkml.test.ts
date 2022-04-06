import {
  jsToXmlOptions as js_xml_options,
  xmlToJsOptions as xml_js_options,
} from '../../shared/lib/fast-xml-parser-config';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Data } from '../../core/data';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { readFileSync } from 'fs';

const generateXml = (ink?: Data): string => {
  return new XMLBuilder(js_xml_options).build(ink);
};

it('an inkml with only one trace but no tracegroups', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/tr1.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_tr1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with only some traces but no tracegroups', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/trn.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_trn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with only one tracegroup but no traces', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/tg1.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_tg1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some tracegroups but no traces', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/tgn.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_tgn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some tracegroups and some traces', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/tgtrn.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_tgtrn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some labelled tracegroups and some traces', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/tg_with_pos.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = generateXml(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/out_tg_with_pos.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
