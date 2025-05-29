import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, ActivityIndicator, Text, useWindowDimensions } from 'react-native';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import WebView from 'react-native-webview';
import { Subsection } from '@/types/types';
import { useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

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
    console.log(subsectionId);
    axios
      .get<Subsection>(`http://localhost:3000/api/modules/subsection/${subsectionId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [subsectionId]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (!data)  return <Text>Loading failed, please try again</Text>;

  // 自定义 iframe 渲染：优先用 YoutubePlayer，否则用 WebView
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
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* 标题 */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        {data.title}
      </Text>

      {/* 渲染 body 中的 HTML */}
      <RenderHtml
        contentWidth={width - 32}
        source={{ html: data.body }}
        renderers={renderers}
        tagsStyles={{
          h1: { fontSize: 26, marginVertical: 8 },
          h2: { fontSize: 22, marginVertical: 6 },
          p:  { fontSize: 16, lineHeight: 24, marginBottom: 8 },
        }}
      />
    </ScrollView>
  );
}
