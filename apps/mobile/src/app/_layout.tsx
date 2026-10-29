import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "../lib/ui.tsx";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTintColor: colors.ink, contentStyle: { backgroundColor: colors.page } }} />
    </>
  );
}
