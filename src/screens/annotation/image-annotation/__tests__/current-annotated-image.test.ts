import { AnyAction } from 'redux';
import { AnnotatedImage } from '../../../../types/annotated-files-types';
import reducer, {
  currentAnnotatedImageAddCrop,
  currentAnnotatedImageRemoveCrop,
  initialState,
  resetCurrentAnnotatedImage,
  setCurrentAnnotatedId,
  setCurrentAnnotatedImage,
  setCurrentAnnotatedImageCropAnnotationAtIndex,
  setCurrentAnnotatedImageCropAtIndex,
  setCurrentAnnotatedImageCrops,
  setCurrentAnnotatedImagePixels,
  setCurrentAnnotatedImageSize,
  setCurrentAnnotatedImageSrc,
} from '../current-annotated-image';
import { Crop } from '../types/image-annotation-types';

let state: AnnotatedImage = {} as AnnotatedImage;
let crop = {} as Crop;

beforeEach(() => {
  crop = {
    cropPath: [
      {
        x: 8,
        y: 8,
      },
      {
        x: 9,
        y: 9,
      },
    ],
    cropAnnotation: 'Another annotation',
  };

  state = {
    id: 'An ID',
    imageSource: 'An image source',
    imagePixels: [
      {
        color: 'A color',
        annotation: 'An annotation',
      },
    ],
    imageCrops: [
      {
        cropPath: [
          {
            x: 1,
            y: 1,
          },
          {
            x: 2,
            y: 2,
          },
        ],
        cropAnnotation: 'An annotation',
      },
    ],
    imageSize: {
      width: 100,
      height: 200,
    },
  };
});

test('should return initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
});

test('should handle an AnnotatedImage being set', () => {
  expect(reducer(initialState, setCurrentAnnotatedImage(state))).toEqual(state);
});

test('should handle image src being set', () => {
  expect(
    reducer(initialState, setCurrentAnnotatedImageSrc('A new image source')),
  ).toEqual({
    ...initialState,
    imageSource: 'A new image source',
  });
});

test('should handle id being set', () => {
  expect(reducer(initialState, setCurrentAnnotatedId('A new id'))).toEqual({
    ...initialState,
    id: 'A new id',
  });
});

test('should handle pixels being set', () => {
  const pixels = [
    {
      color: 'A new color',
      annotation: 'A new annotation',
    },
  ];
  expect(reducer(initialState, setCurrentAnnotatedImagePixels(pixels))).toEqual(
    {
      ...initialState,
      imagePixels: pixels,
    },
  );
});

test('should handle crop being set', () => {
  expect(
    reducer(initialState, setCurrentAnnotatedImageCrops(state.imageCrops)),
  ).toEqual({
    ...initialState,
    imageCrops: state.imageCrops,
  });
});

test('should handle image width being set', () => {
  const size = {
    width: 100,
    height: 200,
  };

  expect(reducer(initialState, setCurrentAnnotatedImageSize(size))).toEqual({
    ...initialState,
    imageSize: size,
  });
});

test('should handle a crop being added to empty list', () => {
  expect(
    reducer(initialState, currentAnnotatedImageAddCrop(state.imageCrops[0])),
  ).toEqual({
    ...initialState,
    imageCrops: state.imageCrops,
  });
});

test('should handle a crop being added to non-empty list', () => {
  expect(reducer(state, currentAnnotatedImageAddCrop(crop))).toEqual({
    ...state,
    imageCrops: [...state.imageCrops, crop],
  });
});

test('should handle a crop removed from list', () => {
  expect(reducer(state, currentAnnotatedImageRemoveCrop(0))).toEqual({
    ...state,
    imageCrops: [],
  });
});

test('should handle a crop with incorrect index list', () => {
  expect(reducer(state, currentAnnotatedImageRemoveCrop(5))).toEqual({
    ...state,
  });
});

test('should handle when removing a crop from empty list', () => {
  expect(reducer(initialState, currentAnnotatedImageRemoveCrop(0))).toEqual(
    initialState,
  );
});

test('should handle a crop being set at index with index in list', () => {
  expect(
    reducer(state, setCurrentAnnotatedImageCropAtIndex({ index: 0, crop })),
  ).toEqual({
    ...state,
    imageCrops: [crop],
  });
});

test('should handle a crop being set at index with index not in list', () => {
  expect(
    reducer(state, setCurrentAnnotatedImageCropAtIndex({ index: 1, crop })),
  ).toEqual({
    ...state,
  });
});

test('should handle a crop annotation being set', () => {
  expect(
    reducer(
      state,
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index: 0,
        annotation: 'A new annotation',
      }),
    ),
  ).toEqual({
    ...state,
    imageCrops: [
      {
        ...state.imageCrops[0],
        cropAnnotation: 'A new annotation',
      },
    ],
  });
});

test('should handle a crop annotation not being set if index not in list', () => {
  expect(
    reducer(
      state,
      setCurrentAnnotatedImageCropAnnotationAtIndex({
        index: 1,
        annotation: 'A new annotation',
      }),
    ),
  ).toEqual({
    ...state,
  });
});

test('should handle the state reset', () => {
  expect(reducer(state, resetCurrentAnnotatedImage())).toEqual(initialState);
});
