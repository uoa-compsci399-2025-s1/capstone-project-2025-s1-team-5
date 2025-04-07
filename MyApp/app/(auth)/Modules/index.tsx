import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ModuleButton from '@/components/ModuleButton';

// Need this to be dynamic for the CMS when future modules are added in the future
type IconName = 'library-books' | 'school' | 'location-on' | 'airplanemode-active';
type Path = '/Modules/module1' | '/Modules/module2' | '/Modules/module3' | '/Modules/module4';

const moduleData: { moduleNumber: number; title: string; iconName: IconName; path: Path }[] = [
  { moduleNumber: 1, title: "Get Set Up For Success", iconName: "library-books", path: '/Modules/module1' },
  { moduleNumber: 2, title: "Academic Preparedness for UoA", iconName: "school", path: '/Modules/module2' },
  { moduleNumber: 3, title: "Connect to the University & New Zealand", iconName: "location-on", path: '/Modules/module3' },
  { moduleNumber: 4, title: "Preparing for Departure", iconName: "airplanemode-active", path: '/Modules/module4' },
];

export default function ModulesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {moduleData.map(({ moduleNumber, title, iconName, path }) => (
        <ModuleButton
          key={moduleNumber} 
          moduleNumber={moduleNumber}
          title={title}
          onPress={() => router.push(path)} 
          iconName={iconName}
        />
      ))}
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
