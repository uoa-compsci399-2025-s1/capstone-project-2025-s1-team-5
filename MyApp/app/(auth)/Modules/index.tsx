import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ModuleButton from '@/components/ModuleButton';

export default function ModulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ModuleButton 
        moduleNumber={1} 
        title="Get Set Up For Success" 
        onPress={() => router.push('/Modules/module1')} 
        iconName="library-books"
      />
      <ModuleButton 
        moduleNumber={2} 
        title="Academic Preparedness for UoA" 
        onPress={() => router.push('/Modules/module2')} 
        iconName="school"
      />
      <ModuleButton 
        moduleNumber={3} 
        title="Connect to the University & New Zealand" 
        onPress={() => router.push('/Modules/module3')} 
        iconName="location-on"
      />
      <ModuleButton 
        moduleNumber={4} 
        title="Preparing for Departure" 
        onPress={() => router.push('/Modules/module4')} 
        iconName="airplanemode-active"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});
