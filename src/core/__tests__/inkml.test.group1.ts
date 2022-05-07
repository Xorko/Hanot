import { readFileSync } from 'fs';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { builder, parser } from '../../lib/fast-xml-parser';
import * as Data from '../data';

it('an inkml with only one trace but no tracegroups', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/tr1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_tr1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with only some traces but no tracegroups', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/trn.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_trn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with only one tracegroup but no traces', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/tg1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_tg1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some tracegroups but no traces', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/tgn.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_tgn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some tracegroups and some traces', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/tgtrn.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_tgtrn.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

it('an inkml with some labelled tracegroups and some traces', async () => {
  const src = readFileSync(
    'src/core/__tests__/resources/group1/tg_with_pos.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build({ ink: exportInk(constructData(inkdata?.ink)) });
  const result = readFileSync(
    'src/core/__tests__/resources/group1/out_tg_with_pos.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
