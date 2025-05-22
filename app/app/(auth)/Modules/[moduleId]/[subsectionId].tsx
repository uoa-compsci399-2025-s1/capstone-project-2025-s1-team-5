import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Image,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '@/app/lib/api';
import StyledText from '@/components/StyledText';
import QuizBlock from '@/components/Quiz';
import { ThemeContext } from '@/contexts/ThemeContext';
// 如果要渲染视频，需要安装并引入 expo-av：
// import { Video } from 'expo-av';

interface LayoutBlock {
  blockId: string;           // 格式：type:data，比如 "text:Hello"、"image:https://…"
  side: 'left' | 'right';
  order: number;
}
interface LayoutConfig {
  split: number[];           // [leftFlex, rightFlex]
  blocks: LayoutBlock[];
}

export default function SubmoduleScreen() {
  const { subsectionId } = useLocalSearchParams<{ subsectionId: string }>();
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  // 默认 50/50
  const [layout, setLayout] = useState<LayoutConfig>({
    split: [50, 50],
    blocks: [],
  });

  useEffect(() => {
    if (!subsectionId) return;
    api
      .get<{ layout: LayoutConfig }>(
        `/modules/subsection/${subsectionId}`
      )
      .then((res) => setLayout(res.data.layout))
      .catch((err) => console.error('拉取布局失败：', err));
  }, [subsectionId]);

  /** 根据 blockId 解析并渲染不同类型的 Block */
  const renderBlock = (block: LayoutBlock) => {
    const [type, data] = block.blockId.split(':', 2);
    switch (type) {
      case 'text':
        return (
          <StyledText
            style={[styles.content, { color: theme.text }]}
          >
            {data}
          </StyledText>
        );
      case 'image':
        return (
          <Image
            source={{ uri: data }}
            style={styles.image}
            resizeMode="contain"
          />
        );
      /* 如果想支持视频，先安装 expo-av，再打开下面代码
      case 'video':
        return (
          <Video
            source={{ uri: data }}
            style={{ width: '100%', height: 200, marginVertical: 12 }}
            useNativeControls
          />
        );
      */
      // case 'quiz':
      //   return <QuizBlock quizId={data} />;
      // default:
      //   return (
      //     <StyledText style={{ color: theme.text }}>
      //       未知 Block 类型：{block.blockId}
      //     </StyledText>
      //   );
    }
  };

  // 左右栏分别过滤、排序、渲染
  const leftColumn = layout.blocks
    .filter((b) => b.side === 'left')
    .sort((a, b) => a.order - b.order)
    .map((b) => (
      <View key={b.blockId} style={styles.blockWrapper}>
        {renderBlock(b)}
      </View>
    ));
  const rightColumn = layout.blocks
    .filter((b) => b.side === 'right')
    .sort((a, b) => a.order - b.order)
    .map((b) => (
      <View key={b.blockId} style={styles.blockWrapper}>
        {renderBlock(b)}
      </View>
    ));

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.row, { width }]}>
        <View style={[styles.column, { flex: layout.split[0] }]}>
          {leftColumn}
        </View>
        <View style={[styles.column, { flex: layout.split[1] }]}>
          {rightColumn}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    padding: 8,
  },
  blockWrapper: {
    marginBottom: 12,
  },
  content: {
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 6,
  },
});
