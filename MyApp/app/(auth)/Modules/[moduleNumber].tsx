import { useLocalSearchParams, useRouter } from 'expo-router';
import ModuleScreen from './modulescreen';

export default function ModuleNumberScreen() {
  const { moduleNumber } = useLocalSearchParams(); 

  const router = useRouter();

  return (
    <ModuleScreen
      moduleNumber={parseInt(moduleNumber as string, 10)}
      onBack={() => router.back()}
    />
  );
}
