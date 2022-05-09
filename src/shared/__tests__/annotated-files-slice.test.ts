import { AnyAction } from 'redux';
import * as Inkml from '../../core/inkml';
import {
  AnnotatedImage,
  AnnotatedInkml,
} from '../../types/annotated-files-types';
import reducer, {
  addAnnotatedImage,
  addAnnotatedInkml,
  initialState,
  setAnnotatedImages,
  setAnnotatedInkml,
} from '../annotated-files-slice';

const image: AnnotatedImage = {
  id: '1',
  imageSource: 'Source',
  imagePixels: [
    { color: '#FFFFFF', annotation: 'background' },
    { color: '#000000', annotation: 'G' },
  ],
  imageCrops: [
    {
      cropPath: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ],
      cropAnnotation: 'G',
    },
  ],
  imageSize: { width: 10, height: 10 },
};

const inkml: AnnotatedInkml = {
  id: '2',
  content: {} as Inkml.Type,
};

test('should return initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
});

test('should handle setAnnotatedImages', () => {
  expect(reducer(initialState, setAnnotatedImages([image]))).toEqual({
    ...initialState,
    annotatedImages: [image],
  });
});

test('should handle addAnnotatedImage to empty array', () => {
  expect(reducer(initialState, addAnnotatedImage(image))).toEqual({
    ...initialState,
    annotatedImages: [image],
  });
});

test('should handle addAnnotatedImage with no image existing with this id', () => {
  const state = {
    ...initialState,
    annotatedImages: [image],
  };
  const newImage = {
    ...image,
    id: '2',
  } as AnnotatedImage;

  expect(reducer(state, addAnnotatedImage(newImage))).toEqual({
    ...state,
    annotatedImages: [image, newImage],
  });
});

test('should handle addAnnotatedImage with image existing with this id', () => {
  const state = {
    ...initialState,
    annotatedImages: [image],
  };
  const newImage = {
    ...image,
    id: '1',
    imageSource: 'Source 2',
  } as AnnotatedImage;

  expect(reducer(state, addAnnotatedImage(newImage))).toEqual({
    ...state,
    annotatedImages: [newImage],
  });
});

test('should handle an annotated inkml being set', () => {
  expect(reducer(initialState, setAnnotatedInkml([inkml]))).toEqual({
    ...initialState,
    annotatedInkml: [inkml],
  });
});

test('should handle an annotated inkml being added to empty list', () => {
  expect(reducer(initialState, addAnnotatedInkml(inkml))).toEqual({
    ...initialState,
    annotatedInkml: [inkml],
  });
});

test('should handle an annotated inkml being added to list with no inkml with the same id', () => {
  const state = {
    ...initialState,
    annotatedInkml: [inkml],
  };

  const newInkml = {
    ...inkml,
    id: '1',
  } as AnnotatedInkml;

  expect(reducer(state, addAnnotatedInkml(newInkml))).toEqual({
    ...state,
    annotatedInkml: [inkml, newInkml],
  });
});

test('should handle an annotated inkml being added to list containing inkml with the same id', () => {
  const state = {
    ...initialState,
    annotatedInkml: [inkml],
  };
  const newInkml = {
    ...inkml,
    id: '2',
  } as AnnotatedInkml;
  expect(reducer(state, addAnnotatedInkml(newInkml))).toEqual({
    ...state,
    annotatedInkml: [newInkml],
  });
});
