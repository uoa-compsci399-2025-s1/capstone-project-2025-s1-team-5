import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext'; 
import { UserContext } from '@/contexts/UserContext';
import { WebView } from 'react-native-webview';
import StyledText from '@/components/StyledText';

import api from '@/app/lib/api';

export default function ProgrammeScreen() {
  const { theme } = useContext(ThemeContext); 
  const { user } = useContext(UserContext);
  const [programmeLink, setProgrammeLink] = useState<string>('');        
  const [isLoading, setIsLoading] = useState<boolean>(true);            
  const [errorMsg, setErrorMsg] = useState<string>(''); 


  useEffect(() => {
  const fetchLink = async () => {
    try {
      const programmeName = user.programme; 
      const response = await api.get<{ _id: string; name: string; description?: string; link: string }[]>('/programmes/');

      const matched = response.data.find(item => item.name === programmeName);

      if (matched && matched.link) {
        setProgrammeLink(matched.link);
      } else {
        setErrorMsg("Couldn't find corresponding programme link.");
      }
    } catch (err) {
      console.error('Failed to fetch course link.', err);
      setErrorMsg('Failed to fetch course information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

    fetchLink();
  }, [user.programme]);

  const { width, height } = Dimensions.get('window');

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, padding: 24 }]}>
        <StyledText type="error">{errorMsg}</StyledText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <WebView
        source={{ uri: programmeLink }}
        style={{ width: width, height: height }}
        startInLoadingState={true}
        renderError={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StyledText type="error">Failed to load the page. Please check your internet connection or try again later.</StyledText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});