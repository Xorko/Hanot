import { readFileSync } from 'fs';
import * as Data from '../../core/data';
import { constructData } from '../input';
import { exportInk } from '../output';
import { builder, parser } from '../../lib/fast-xml-parser';

test('oldTrace', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group4/trace-with-old-trace.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/core/__tests__/resources/group4/trace-with-old-trace.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
