import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/app/lib/api";
import SubModuleButton from "@/components/SubModuleButton";
import { ThemeContext } from "@/contexts/ThemeContext";

interface SubsectionItem { id: string; title: string; }

interface LinkItem {
  id: string;
  title: string;
  link: string;
}


export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [subs, setSubs] = useState<SubsectionItem[]>([]);

  const [links, setLinks] = useState<LinkItem[]>([
  { id: 'link-1', title: 'Expo Docs', link: 'https://docs.expo.dev' },
  { id: 'link-2', title: 'React Native', link: 'https://reactnative.dev' }
]);


  useEffect(() => {
    if (!moduleId) return;
    api.get<{ subsections: { id: string; title: string }[] }>(`/modules/${moduleId}`)
       .then(res => setSubs(res.data.subsections))
       .catch(console.error);
  }, [moduleId]);

  return (
    <ScrollView style={[styles.ctn, { backgroundColor: theme.background }]}>
      {subs.map(s => (
        <SubModuleButton
          key={s.id}
          title={s.title}
          onPress={() =>
            router.push(`/Modules/${moduleId}/${s.id}`)
          }
        />
      ))}

      {/* Links button */}
      {links.map(l => (
        <SubModuleButton                 
          key={l.id}
          title={l.title}
          onPress={() => router.push({
            pathname: `/Modules/[moduleId]/LinkViewer`,
            params: { url: l.link, title: l.title, moduleId }
            })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ctn: { flex: 1, padding: 24 }
});
