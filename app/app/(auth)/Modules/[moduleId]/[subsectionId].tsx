import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, ActivityIndicator, Text, useWindowDimensions, View, StyleSheet } from 'react-native';
import { Subsection } from '@/types/types';
import { useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import WebView from 'react-native-webview';

import api from '@/app/lib/api';

export default function SubsectionScreen() {
  const { width } = useWindowDimensions();
  const { moduleId, subsectionId } = useLocalSearchParams<{
    moduleId: string;
    subsectionId: string;
  }>();
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState<Subsection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Subsection>(`/modules/subsection/${subsectionId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [subsectionId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (!data) return <Text style={{ color: theme.text }}>Loading failed, please try again</Text>;

  const renderers = {
    iframe: (props: any) => {
      const src = (props.tnode.attributes.src ?? '').toString();
      const match = src.match(/youtube\.com\/embed\/([\w-]+)/);
      if (match) {
        return <YoutubePlayer height={230} videoId={match[1]} />;
      }
      return (
        <WebView
          source={{ uri: src }}
          style={{ width: '100%', height: 230, borderRadius: 8 }}
        />
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <RenderHtml
          contentWidth={width - 32}
          source={{ html: data.body }}
          WebView={WebView}
          enableCSSInlineProcessing={true}
          renderers={{ iframe: IframeRenderer }}
          customHTMLElementModels={{ iframe: iframeModel }}
          tagsStyles={{
            p: {
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 8,
              color: theme.text,
            },
            strong: {
              fontWeight: 'bold',
              color: theme.text,
            },
            b: {
              fontWeight: 'bold',
              color: theme.text,
            },
            em: {
              fontStyle: 'italic',
              color: theme.text,
            },
            i: {
              fontStyle: 'italic',
              color: theme.text,
            },
            h2: {
              fontSize: 22,
              marginVertical: 6,
              fontWeight: '600',
              color: theme.text,
            },
            h3: {
              fontSize: 18,
              marginVertical: 4,
              fontWeight: '600',
              color: theme.text,
            },
            ul: {
              marginVertical: 8,
              paddingLeft: 16,
              color: theme.text,
            },
            ol: {
              marginVertical: 8,
              paddingLeft: 24,
              color: theme.text,
            },
            li: {
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 4,
              marginLeft: 4,
              color: theme.text,
            },
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20,
  },
});
