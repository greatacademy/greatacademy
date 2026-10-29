import { Link, Stack } from "expo-router";
import { FlatList, Pressable, Text } from "react-native";

import { m, tx } from "../lib/i18n.ts";
import { catalog } from "../lib/rpc.ts";
import { Loaded, styles } from "../lib/ui.tsx";
import { useRpc } from "../lib/useRpc.ts";

/** The course list: the first screen, reachable without an account. */
export default function Courses() {
  const rpc = useRpc(() => catalog.listCourses({}));
  return (
    <>
      <Stack.Screen options={{ title: m.courses }} />
      <Loaded rpc={rpc}>
        {({ courses }) => (
          <FlatList
            style={styles.page}
            contentContainerStyle={styles.list}
            data={courses}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <Link href={{ pathname: "/courses/[courseId]", params: { courseId: item.id } }} asChild>
                <Pressable style={styles.card}>
                  <Text style={styles.muted}>{tx(item.subjectTitle)}</Text>
                  <Text style={styles.title}>{tx(item.title)}</Text>
                  <Text style={styles.body}>{tx(item.description)}</Text>
                  <Text style={styles.muted}>{m.topics(item.topicCount)}</Text>
                </Pressable>
              </Link>
            )}
          />
        )}
      </Loaded>
    </>
  );
}
