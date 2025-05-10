import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SubmoduleScreen from './submodulescreen';

const SubmoduleRoute = () => {
  const params = useLocalSearchParams();
  const moduleNumber = parseInt(params.moduleNumber as string);
  const submoduleId = params.submoduleNumber as string; // Changed to submoduleNumber

  return (
    <SubmoduleScreen
      moduleNumber={moduleNumber}
      submoduleId={submoduleId}
    />
  );
};

export default SubmoduleRoute;