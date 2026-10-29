import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { m, tx } from "../../lib/i18n.ts";
import { catalog } from "../../lib/rpc.ts";
import { Loaded, styles } from "../../lib/ui.tsx";
import { useRpc } from "../../lib/useRpc.ts";

/** A course's outline. Enrolling and learning stay on the web app for now. */
export default function CourseOutline() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const rpc = useRpc(() => catalog.getCourse({ courseId }));
  return (
    <Loaded rpc={rpc}>
      {({ course }) => (
        <ScrollView style={styles.page} contentContainerStyle={styles.list}>
          <Stack.Screen options={{ title: tx(course?.title) }} />
          <Text style={styles.muted}>{m.soon}</Text>
          {course?.units.map((unit, u) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the outline is static and units have no id.
            <View key={u} style={styles.card}>
              <Text style={styles.title}>{tx(unit.title)}</Text>
              {unit.modules.map((mod, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: as above.
                <View key={i}>
                  <Text style={styles.heading}>{tx(mod.title)}</Text>
                  {mod.topics.map((t) => (
                    <Text key={t.id} style={styles.body}>
                      · {tx(t.title)}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </Loaded>
  );
}
