import { parser, builder } from '../../lib/fast-xml-parser';
import * as Data from '../../core/data';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { readFileSync } from 'fs';

test('noise', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group3/noise.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
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
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group3/pending.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
