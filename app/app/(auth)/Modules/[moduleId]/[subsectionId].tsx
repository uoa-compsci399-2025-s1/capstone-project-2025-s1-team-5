import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, ActivityIndicator, Text, useWindowDimensions } from 'react-native';
import api from '@/app/lib/api';
import RenderHtml from 'react-native-render-html';
import YoutubePlayer from 'react-native-youtube-iframe';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
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
    api
      .get<Subsection>(`/modules/subsection/${subsectionId}`)
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
        WebView={WebView}
        renderers={{ iframe: IframeRenderer }}
        customHTMLElementModels={{ iframe: iframeModel }}
        tagsStyles={{
          p: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 8,
            /* 默认左对齐，如果你的后端 HTML 里带了 style="text-align:xxx"，那么需要在 ignoredStyles 里去掉 textAlign 才能生效 */
            textAlign: 'left',
          },
          strong: {
            fontWeight: 'bold',
          },
          b: {
            fontWeight: 'bold',
          },
          em: {
            fontStyle: 'italic',
          },
          i: {
            fontStyle: 'italic',
          },
          h2: {
            fontSize: 22,
            marginVertical: 6,
            fontWeight: '600', 
          },
          h3: {
            fontSize: 18,
            marginVertical: 4,
            fontWeight: '600',
          },
          ul: {
            marginVertical: 8,
            paddingLeft: 16, 
          },
          ol: {
            marginVertical: 8,
            paddingLeft: 16,
          },
          li: {
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 4, 
          },
        }}
      />
    </ScrollView>
  );
}
