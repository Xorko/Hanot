/**
 * When compiling for mobile, it will search for index.js on root.
 */

import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import App from './src/App';
import { name as appName } from './src/app.json';
import 'react-native-get-random-values';

AppRegistry.registerComponent(appName, () => App);
