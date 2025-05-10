import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SubmoduleScreen from './submodulescreen';

const SubmoduleRoute = () => {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();

  return (
    <SubmoduleScreen
      moduleNumber={Number(moduleNumber)}
      submoduleNumber={Number(submoduleNumber)}
    />
  );
};

export default SubmoduleRoute;