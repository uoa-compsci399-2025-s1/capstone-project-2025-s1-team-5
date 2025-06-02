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
          h1: { fontSize: 26, marginVertical: 8 },
          h2: { fontSize: 22, marginVertical: 6 },
          p:  { fontSize: 16, lineHeight: 24, marginBottom: 8 },
        }}
      />
    </ScrollView>
  );
}

// import React, { useEffect, useState, useContext } from 'react';
// import { ScrollView, ActivityIndicator, Text, View, TouchableOpacity, useWindowDimensions } from 'react-native';
// import api from '@/app/lib/api';
// import RenderHtml from 'react-native-render-html';
// import YoutubePlayer from 'react-native-youtube-iframe';
// import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
// import WebView from 'react-native-webview';
// import { Subsection, Quiz } from '@/types/types';
// import { useLocalSearchParams } from 'expo-router';
// import { ThemeContext } from '@/contexts/ThemeContext';
//
// export default function SubsectionScreen() {
//   const { width } = useWindowDimensions();
//   const { moduleId, subsectionId } = useLocalSearchParams<{
//     moduleId: string;
//     subsectionId: string;
//   }>();
//   const { theme } = useContext(ThemeContext);
//
//   const [data, setData] = useState<Subsection | null>(null);
//   const [quiz, setQuiz] = useState<Quiz | null>(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     if (!subsectionId) return;
//
//     const fetchSubsectionAndQuiz = async () => {
//       try {
//         const [subRes, quizRes] = await Promise.all([
//           api.get<Subsection>(`/modules/subsection/${subsectionId}`),
//           api.get<Quiz>(`/modules/subsection/${subsectionId}/quiz`)
//         ]);
//
//         setData(subRes.data);
//         setQuiz(quizRes.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchSubsectionAndQuiz();
//   }, [subsectionId]);
//
//   if (loading) {
//     return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
//   }
//
//   if (!data) {
//     return <Text>Loading failed, please try again</Text>;
//   }
//
//   const renderers = {
//     iframe: (props: any) => {
//       const src = (props.tnode.attributes.src ?? '').toString();
//       const match = src.match(/youtube\.com\/embed\/([\w-]+)/);
//       if (match) {
//         return <YoutubePlayer height={230} videoId={match[1]} />;
//       }
//       return (
//         <WebView
//           source={{ uri: src }}
//           style={{ width: '100%', height: 230, borderRadius: 8 }}
//         />
//       );
//     }
//   };
//
//   return (
//     <ScrollView contentContainerStyle={{ padding: 16 }}>
//       <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
//         {data.title}
//       </Text>
//
//       <RenderHtml
//         contentWidth={width - 32}
//         source={{ html: data.body }}
//         WebView={WebView}
//         renderers={{ iframe: IframeRenderer }}
//         customHTMLElementModels={{ iframe: iframeModel }}
//         tagsStyles={{
//           h1: { fontSize: 26, marginVertical: 8 },
//           h2: { fontSize: 22, marginVertical: 6 },
//           p: { fontSize: 16, lineHeight: 24, marginBottom: 8 },
//         }}
//       />
//
//       {quiz && (
//         <View style={{ marginTop: 24 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
//             Quiz: {quiz.title}
//           </Text>
//           <Text style={{ fontStyle: 'italic', marginBottom: 16 }}>{quiz.description}</Text>
//
//           {quiz.questions.map((q, index) => (
//             <View key={q._id} style={{ marginBottom: 20 }}>
//               <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>
//                 {index + 1}. {q.question}
//               </Text>
//
//               {q.options.map((option, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={{
//                     backgroundColor: '#f2f2f2',
//                     padding: 10,
//                     borderRadius: 8,
//                     marginTop: 6,
//                   }}
//                   onPress={() => {
//                     // Placeholder for handling answer selection
//                     console.log(`Selected: ${option} for question ${q._id}`);
//                   }}
//                 >
//                   <Text>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }
