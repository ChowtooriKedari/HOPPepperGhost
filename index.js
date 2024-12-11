/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Amplify} from '@aws-amplify/core';
import awsExports from './src/aws/aws-exports';
console.log('AWS Exports:', awsExports); // Check if this logs the correct object

if (!Amplify) {
  console.error('Amplify is not defined');
} else {
  Amplify.configure(awsExports);
}

AppRegistry.registerComponent(appName, () => App);
