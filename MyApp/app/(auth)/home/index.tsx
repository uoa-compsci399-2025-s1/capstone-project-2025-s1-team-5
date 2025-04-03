import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();  
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
}