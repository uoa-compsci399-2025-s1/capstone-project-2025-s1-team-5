// app/Modules/[moduleId]/[subsectionId].tsx
import React, { useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Image,
  Text,
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import api from '@/app/lib/api'
import { ThemeContext } from '@/contexts/ThemeContext'
import RenderHTML from 'react-native-render-html'
// 如果你要支持视频，安装 expo-av 并引入
// import { Video } from 'expo-av'

interface BlockConfig {
  id: string
  type: 'text' | 'image' | 'video'
  html: string
}
interface ColumnConfig {
  blocks: BlockConfig[]
}
interface SectionConfig {
  id: string
  layout: 'full' | 'split'
  splitRatio?: number[]
  columns: ColumnConfig[]
}
interface LayoutConfig {
  sections: SectionConfig[]
}

export default function SubmoduleScreen() {
  const { subsectionId } = useLocalSearchParams<{ subsectionId: string }>()
  const { theme } = useContext(ThemeContext)
  const { width } = useWindowDimensions()

  const [layout, setLayout] = useState<LayoutConfig>({ sections: [] })

  useEffect(() => {
    if (!subsectionId) return
    api
      .get<{ layout: LayoutConfig }>(
        `/modules/subsection/${subsectionId}`,
      )
      .then((res) => {
        setLayout(res.data.layout ?? { sections: [] })
      })
      .catch((err) => console.error('拉取布局失败：', err))
  }, [subsectionId])

  const renderBlock = (blk: BlockConfig) => {
    switch (blk.type) {
      case 'text':
        // 最简单用原始 html 作为纯文本
        return (
        <RenderHTML
          contentWidth={width}
          source={{ html: blk.html }}
          enableCSSInlineProcessing={true}
           allowedStyles={[
            // 文本格式
            'color',
            'fontSize',
            'fontWeight',
            'fontStyle',
            'lineHeight',
            // 对齐
            'textAlign',
            // 外边距
            'marginTop',
            'marginBottom',
            'marginLeft',
            'marginRight',
            // 内边距
            'paddingTop',
            'paddingBottom',
            'paddingLeft',
            'paddingRight',
          ]}
          tagsStyles={{
            /* 标题 */
            h2: {
              fontSize: 24,
              fontWeight: 'bold',
              marginVertical: 12,
            },
            h3: {
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 10,
            },

            /* 段落 */
            p: {
              fontSize: 16,
              marginVertical: 8,
              lineHeight: 24,
            },

            /* 加粗/斜体 */
            strong: { fontWeight: 'bold' },
            em:     { fontStyle: 'italic' },

            /* 无序列表 */
            ul: {
              marginVertical: 8,
              paddingLeft: 20,
              listStyleType: 'disc',
            },

            /* 有序列表 */
            ol: {
              marginVertical: 8,
              paddingLeft: 20,
              listStyleType: 'decimal',
            },

            /* 列表项 */
            li: {
              marginVertical: 4,
              lineHeight: 24,
            },
          }}
        />
      )
      case 'image':
        return (
          <Image
            source={{ uri: blk.html }}
            style={styles.image}
            resizeMode="contain"
          />
        )
      // case 'video':
      //   return (
      //     <Video
      //       source={{ uri: blk.html }}
      //       style={{ width: '100%', height: 200, marginVertical: 12 }}
      //       useNativeControls
      //     />
      //   )
      default:
        return (
          <Text style={{ color: theme.text }}>
            未知 Block 类型：{JSON.stringify(blk)}
          </Text>
        )
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {layout.sections.map((sec) => (
        <View key={sec.id} style={[styles.row, { width }]}>
          {sec.columns.map((col, ci) => {
            // full 时强制 flex:1；split 时用 splitRatio
            const flex = sec.layout === 'split' && sec.splitRatio
              ? sec.splitRatio[ci]
              : 1
            return (
              <View
                key={ci}
                style={[styles.column, { flex }]}
              >
                {col.blocks
                  .map((blk) => (
                    <View key={blk.id} style={styles.blockWrapper}>
                      {renderBlock(blk)}
                    </View>
                  ))}
              </View>
            )
          })}
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})
