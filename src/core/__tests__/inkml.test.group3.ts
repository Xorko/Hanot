import { readFileSync } from 'fs';
import * as Data from '../../core/data';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { builder, parser } from '../../lib/fast-xml-parser';

test('noise', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group3/noise.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group3/noise.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('pending', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group3/pending.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group3/pending.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
