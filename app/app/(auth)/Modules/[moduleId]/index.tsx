import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeContext } from "@/contexts/ThemeContext";
import { SubsectionItem, LinkItem, ModuleDetail, QuizItem } from "@/types/types";
import SubModuleButton from "@/components/SubModuleButton";

import api from "@/app/lib/api";

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [subs, setSubs] = useState<SubsectionItem[]>([]);
  const [links,setLinks]  = useState<LinkItem[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);

  useEffect(() => {
    if (!moduleId) return;
    api.get<ModuleDetail>(`/modules/${moduleId}`)
       .then(res => {
          setSubs(res.data.subsections);
          setLinks(res.data.links);
          setQuizzes(res.data.quizzes);
        })
       .catch(console.error);
  }, [moduleId]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {subs.map(s => (
        <SubModuleButton
          key={s.id}
          title={s.title}
          onPress={() =>
            router.push({
              pathname: `/Modules/[moduleId]/[subsectionId]`,
              params: {
                moduleId,
                subsectionId: s.id,
                title: s.title,
              }
            })
          }
        />
      ))}
      {links.map(l => (
        <SubModuleButton                 
          key={l.id}
          title={l.title}
          onPress={() => router.push({
            pathname: `/Modules/[moduleId]/LinkViewer`,
            params: { url: l.url, title: l.title, moduleId }
            })
          }
        />
      ))}
      {quizzes.map(q => (
        <SubModuleButton
          key={q.id}
          title={`Quiz: ${q.title}`}
          onPress={() =>
            router.push({
              pathname: '/Modules/[moduleId]/QuizViewer',
              params: { moduleId, quizId: q.id, title: q.title }
            })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 20,
  },
});
