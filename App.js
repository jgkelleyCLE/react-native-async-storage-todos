import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Screens/Home';

export default function App() {
  return (
    <View className="flex-1 bg-gray-200">
     <Home />
      <StatusBar style="auto" />
    </View>
  );
}


