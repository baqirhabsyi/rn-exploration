/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import {name as appName} from './app.json';
import App from './src/app';

// NOTE: We're not using any react-navigation functionality that is affected by
// passing Date value via params
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

AppRegistry.registerComponent(appName, () => App);
