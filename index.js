/**
 * When compiling for mobile, it will search for index.js on root.
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './src/App';
import {name as appName} from './src/app.json';

AppRegistry.registerComponent(appName, () => App);
