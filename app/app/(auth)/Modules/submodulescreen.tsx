import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import StyledText from '@/components/StyledText';
import { moduleSubmodules } from './modulescreen';
import { ThemeContext } from '@/contexts/ThemeContext'; // Adjust if needed

import axios from "axios";

interface LayoutBlock {
  blockId: string;
  side: "left" | "right";
  order: number;
}
interface LayoutConfig {
  split: number[];          // [leftFlex, rightFlex]
  blocks: LayoutBlock[];
}

export default function SubmoduleScreen() {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();
  const moduleIndex = Number(moduleNumber);
  const submoduleIndex = Number(submoduleNumber);
  const submodule = moduleSubmodules[moduleIndex]?.[submoduleIndex];
  const { subsectionId } = useLocalSearchParams<{ subsectionId: string }>();
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const [layout, setLayout] = useState<LayoutConfig>({
      split: [50, 50],
      blocks: [],
    });

  useEffect(() => {
    if (!subsectionId) return;
    axios
      .get<{ layout: LayoutConfig }>(`http://172.23.46.18:3000/modules/subsection/${subsectionId}`)
      .then((res) => {
        setLayout(res.data.layout);
      })
      .catch((err) => {
        console.error("拉取布局失败：", err);
      });
  }, [subsectionId]);
    // 按 side 和 order 拆分渲染
  const leftBlocks = layout.blocks
    .filter((b) => b.side === "left")
    .sort((a, b) => a.order - b.order)
    .map((b) => (
      <View key={b.blockId} style={styles.block}>
        <Text>Block: {b.blockId}</Text>
        {/* 这里换成你的实际 BlockRenderer，比如 <BlockRenderer id={b.blockId}/> */}
      </View>
    ));

  const rightBlocks = layout.blocks
    .filter((b) => b.side === "right")
    .sort((a, b) => a.order - b.order)
    .map((b) => (
      <View key={b.blockId} style={styles.block}>
        <Text>Block: {b.blockId}</Text>
      </View>
    ));

  if (!submodule) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <StyledText type="error">Submodule not found</StyledText>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <StyledText style={{ ...styles.content, color: theme.text }}>
        This is where content for "{submodule.title}" would go.
      </StyledText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    lineHeight: 24,
  },
  block: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
});