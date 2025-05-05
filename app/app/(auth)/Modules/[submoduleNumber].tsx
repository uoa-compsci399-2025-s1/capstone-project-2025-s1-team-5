import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import SubmoduleInfoScreen from './submoduleinfoscreen';

const SubmoduleRoute = () => {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();

  return (
    <SubmoduleInfoScreen
      moduleNumber={Number(moduleNumber)}
      submoduleNumber={Number(submoduleNumber)}
    />
  );
};

export default SubmoduleRoute;