import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Amplify } from '@aws-amplify/core';
import awsExports from './src/aws/aws-exports';
console.log(awsExports);
console.log(appName);
Amplify.configure(awsExports);
// AppRegistry.registerComponent(appName, () => App);
import { registerRootComponent } from 'expo';

registerRootComponent(App);
