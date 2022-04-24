import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useAppSelector } from '../../../../stores/hooks';
import { CurrentAnnotatedImageState } from '../current-annotated-image';
import { Point, Size } from '../types/image-annotation-types';
import { getScript } from '../utils/crop-utils';

interface CropPropsType {
  path: Point[];
  size: Size;
}

/* A crop of the image */
const Crop = ({ path, size }: CropPropsType) => {
  //===========================================================================
  // Redux
  //===========================================================================

  // Retrieves the image source from the redux store
  const imageSrc = useAppSelector(
    (state: { currentAnnotatedImage: CurrentAnnotatedImageState }) =>
      state.currentAnnotatedImage.annotatedImage.imageSource,
  );

  //===========================================================================
  // Variables
  //===========================================================================

  const webViewRef = useRef<any>();

  //===========================================================================
  // Render
  //===========================================================================

  // when the image source or the path or the size changes, reload the webview to update the crop
  useEffect(() => {
    if (imageSrc) {
      webViewRef.current?.reload();
    }
  }, [imageSrc, path, size]);

  return (
    <WebView
      style={{
        ...styles.webView,
        maxHeight: size.height,
        maxWidth: size.width,
      }}
      scalesPageToFit={false}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      originWhitelist={['*']}
      source={{
        html: `<canvas width={${size.width}} height={${size.height}} />`,
      }}
      onMessage={() => {}}
      injectedJavaScript={getScript(path, size, imageSrc)}
      ref={webViewRef}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    backgroundColor: 'transparent',
  },
});

export default Crop;
