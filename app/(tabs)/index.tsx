import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Profile from "./Profile";
import GoalsPage from "../../components/pages/goalsPage";

export default function HomeScreen() {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  return userInfo ? (
    <GoalsPage />
  ) : (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Lütfen Giriş Yapınız.</Text>
      </View>
      <View style={styles.contentProfile}>
        <Profile />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  content: {},
  text: {
    marginTop: 250,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#114161",
    fontSize: 20,
  },
  contentProfile: {
    minWidth: "100%",
    justifyContent: "center",
    marginBottom: 245,
  },
});
