import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import Canvas, {Image as CanvasImage} from 'react-native-canvas';
import {ImageSourceContext} from '../context/ImageSourceContext';
import {Size} from '../types/Types';

const ImageAnnotationArea = () => {
  const {imageSource} = useContext(ImageSourceContext);

  const imageSize: Size = {width: 400, height: 200};

  /**
   * Creates a canvas element and draws the image on it with the size adjusted.
   * @param {Canvas} canvas - The canvas element to draw the image on.
   */
  const handleCanvas = (canvas: Canvas) => {
    if (canvas) {
      const context = canvas.getContext('2d');
      const image = new CanvasImage(canvas);

      image.addEventListener('load', async () => {
        canvas.width = imageSize.width;
        canvas.height = imageSize.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height); // TODO: adjust the image size and add border around
      });

      image.src = imageSource;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Canvas ref={handleCanvas} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    position: 'absolute',
  },
});

export default ImageAnnotationArea;
