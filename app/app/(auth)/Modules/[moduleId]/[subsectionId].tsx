import React, { useEffect, useState, useContext } from 'react'
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { Video, ResizeMode } from 'expo-av'
import RenderHTML, {
  defaultSystemFonts,
} from 'react-native-render-html'
import { useLocalSearchParams } from 'expo-router'
import api from '@/app/lib/api'
import { ThemeContext } from '@/contexts/ThemeContext'

interface ISubsection {
  id: string
  title: string
  body: string
}

export default function SubmoduleScreen() {
  const { subsectionId } = useLocalSearchParams<{ subsectionId: string }>()
  const { theme } = useContext(ThemeContext)
  const { width } = useWindowDimensions()

  const [subsection, setSubsection] = useState<ISubsection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subsectionId) return
    setLoading(true)
    api.get<ISubsection>(`/modules/subsection/${subsectionId}`)
      .then(res => setSubsection(res.data))
      .catch(() => setError('加载失败，请稍后重试'))
      .finally(() => setLoading(false))
  }, [subsectionId])

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} size="large" />
      </View>
    )
  }
  
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>{error}</Text>
      </View>
    )
  }
  
  if (!subsection) return null

  // Custom HTML element models for iframe and video
  const customHTMLElementModels = {
    iframe: HTMLElementModel.fromCustomModel({
      tagName: 'iframe',
      contentModel: HTMLContentModel.block,
    }),
    video: HTMLElementModel.fromCustomModel({
      tagName: 'video',
      contentModel: HTMLContentModel.block,
    }),
  }

  // Custom renderers for iframe and video elements
  const renderers: Record<string, CustomRenderer> = {
    iframe: ({ tnode }: any) => {
      const src = tnode.attributes.src as string
      if (!src) return null

      return (
        <View style={styles.mediaContainer}>
          <WebView
            source={{ uri: src }}
            style={[styles.webview, { height: ((width - 32) * 9) / 16 }]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.text} />
              </View>
            )}
          />
        </View>
      )
    },
    
    video: ({ tnode }: any) => {
      const src = tnode.attributes.src as string
      if (!src) return null

      return (
        <View style={styles.mediaContainer}>
          <Video
            source={{ uri: src }}
            style={[styles.video, { width: width - 32 }]}
            useNativeControls={true}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            isLooping={false}
          />
        </View>
      )
    },
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {subsection.title}
      </Text>
      
      <RenderHTML
        contentWidth={width - 32}
        source={{ html: subsection.body }}
        enableCSSInlineProcessing={true}
        systemFonts={[...defaultSystemFonts, 'Arial', 'Helvetica']}
        renderers={renderers}
        tagsStyles={{
          body: {
            color: theme.text,
            fontSize: 16,
            lineHeight: 24,
          },
          p: {
            marginVertical: 8,
            lineHeight: 24,
            fontSize: 16,
            color: theme.text,
          },
          h1: {
            fontSize: 28,
            marginVertical: 16,
            fontWeight: 'bold',
            color: theme.text,
          },
          h2: {
            fontSize: 24,
            marginVertical: 12,
            fontWeight: 'bold',
            color: theme.text,
          },
          h3: {
            fontSize: 20,
            marginVertical: 10,
            fontWeight: 'bold',
            color: theme.text,
          },
          img: {
            marginVertical: 12,
            borderRadius: 8,
          },
          a: {
            color: theme.primary || '#007AFF',
            textDecorationLine: 'underline',
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
            marginVertical: 4,
            color: theme.text,
          },
          blockquote: {
            marginVertical: 12,
            marginHorizontal: 16,
            paddingLeft: 16,
            borderLeftWidth: 4,
            borderLeftColor: theme.primary || '#007AFF',
            fontStyle: 'italic',
          },
        }}
        baseStyle={{
          color: theme.text,
          fontSize: 16,
        }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  mediaContainer: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  video: {
    height: 200,
    backgroundColor: '#000',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
})