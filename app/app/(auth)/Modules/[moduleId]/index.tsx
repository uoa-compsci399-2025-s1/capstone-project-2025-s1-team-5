import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/app/lib/api";
import SubModuleButton from "@/components/SubModuleButton";
import { ThemeContext } from "@/contexts/ThemeContext";

interface SubsectionItem { id: string; title: string; }

export default function ModuleDetailScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [subs, setSubs] = useState<SubsectionItem[]>([]);

  useEffect(() => {
    if (!moduleId) return;
    console.log(moduleId);
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ctn: { flex: 1, padding: 24 }
});
