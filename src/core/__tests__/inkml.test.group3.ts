import {
  jsToXmlOptions as js_xml_options,
  xmlToJsOptions as xml_js_options,
} from '../../shared/lib/fast-xml-parser-config';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { Data } from '../../core/data';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { readFileSync } from 'fs';

test('noise', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group3/noise.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = new XMLBuilder(js_xml_options).build(
    exportInk(constructData(inkdata?.ink)),
  );
  const result = readFileSync(
    'src/__tests__/test_api/resources/group3/noise.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('pending', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group3/pending.inkml',
    'utf-8',
  );
  const inkdata = new XMLParser(xml_js_options).parse(src) as Data;
  const gen = new XMLBuilder(js_xml_options).build(
    exportInk(constructData(inkdata?.ink)),
  );
  const result = readFileSync(
    'src/__tests__/test_api/resources/group3/pending.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
