import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from './src/screens/Dashboard';
import PostDetails from './src/screens/PostDetails';
import notifee, { AndroidImportance } from '@notifee/react-native';
const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    async function requestPermission() {
      await notifee.requestPermission();
    }
    requestPermission();
  }, []);
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
       
      />
      <Stack.Screen name="PostDetails" component={PostDetails} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})