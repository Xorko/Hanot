import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type { Size } from '../../../../types/coordinates-types';
import { getScript } from '../utils/pixels-utils';

type PixelRecoveryPropsType = {
  imageSize: Size;
  handleWebviewMessages: (event: WebViewMessageEvent) => void;
  imageSrc: string;
};

function PixelRecovery({
  imageSize,
  handleWebviewMessages,
  imageSrc,
}: PixelRecoveryPropsType) {
  return (
    <WebView
      originWhitelist={['*']}
      source={{
        html: `<canvas width="${imageSize.width}" height="${imageSize.height}" />`,
      }}
      onMessage={handleWebviewMessages}
      injectedJavaScript={getScript(imageSrc, imageSize)}
    />
  );
}

export default PixelRecovery;
