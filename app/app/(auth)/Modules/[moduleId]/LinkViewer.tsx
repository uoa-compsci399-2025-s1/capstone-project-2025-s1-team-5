import React from 'react';   
import { useLocalSearchParams } from 'expo-router';
import WebView from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';

export default function LinkViewer() {
  const { url , title } = useLocalSearchParams<{
    url: string;
    title: string;
  }>();

  if (!url) return null;

  return (
    <WebView
      source={{ uri: url }}
      startInLoadingState
      renderLoading={() => (
        <View style={{ flex:1, justifyContent:'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
}
