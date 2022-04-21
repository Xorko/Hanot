import { parser, builder } from '../../lib/fast-xml-parser';
import * as Data from '../../core/data';
import { constructData } from '../../core/input';
import { exportInk } from '../../core/output';
import { readFileSync } from 'fs';

test('input example with pre segmentation', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/inputExampleWithPreSeg_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/inputExampleWithPreSeg_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('output example v1', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/outputExample_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/outputExample_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('abeille', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_abeille_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_abeille_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('fenetre', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_fenetre_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_fenetre_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('gateau', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_gateau_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_gateau_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('longtemps', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_longtemps_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_longtemps_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});

test('riviere', async () => {
  const src = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_riviere_V1.inkml',
    'utf-8',
  );
  const inkdata = parser.parse(src) as Data.Type;
  const gen = builder.build(exportInk(constructData(inkdata?.ink)));
  const result = readFileSync(
    'src/__tests__/test_api/resources/group2/strokes_riviere_V1.inkml',
    'utf-8',
  );
  expect(gen).toBe(result);
});
