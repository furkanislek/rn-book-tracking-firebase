import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import { useEffect, useState } from "react";
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
import {
  setUserInfo,
  setEmail,
  setAuthUser,
  setAuthIsLogin,
  setAuthPassword,
} from "@/components/store/Slicers/auth";
import { useSelector, useDispatch } from "react-redux";
import Config from "react-native-config";

const firebaseConfig = {
  apiKey: Config.API_KEY,
  authDomain: Config.AUTH_DOMAIN,
  projectId: Config.PROJECT_ID,
  storageBucket: Config.STORAGE_BUCKET,
  messagingSenderId: Config.MESSAGING_SENDER_ID,
  appId: Config.APP_ID,
  measurementId: Config.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  isLogin,
  setIsLogin,
  handleAuthentication,
}: any) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? "Sign In" : "Sign Up"}</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title={isLogin ? "Sign In" : "Sign Up"}
          onPress={handleAuthentication}
          color="#3498db"
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </View>
    </View>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }: any) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default function Profile() {
  //#region dispatchs
  const dispatch = useDispatch();

  const dispatchEmail = (email: string) => {
    dispatch(setEmail(email));
  };

  const dispatchPassword = (password: any) => {
    dispatch(setAuthPassword(password));
  };

  const dispatchUserInfo = (user: any) => {
    dispatch(setAuthUser(user));
  };

  const dispatchIsLogin = (login: any) => {
    dispatch(setAuthIsLogin(login));
  };
  //#endregion

  //#regionSelectors
  const email = useSelector((state: any) => state.auth.email);
  const authPassword = useSelector((state: any) => state.auth.authPassword);
  const authUser = useSelector((state: any) => state.auth.user);
  const authIsLogin = useSelector((state: any) => state.auth.isLogin);
  //#endregion

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      dispatchUserInfo(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const dispatchUser = () => {
    dispatch(setUserInfo(authUser?.email));
  };
  useEffect(() => {
    dispatchUser();
  }, [authIsLogin, authUser]);

  const handleAuthentication = async () => {
    try {
      if (authUser) {
        console.log("User logged out successfully!");
        await signOut(auth);
      } else {
        if (authIsLogin) {
          await signInWithEmailAndPassword(auth, email, authPassword);
          console.log("User signed in successfully!");
        } else {
          await createUserWithEmailAndPassword(auth, email, authPassword);
          console.log("User created successfully!");
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {authUser ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen
          user={authUser}
          handleAuthentication={handleAuthentication}
        />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={dispatchEmail}
          password={authPassword}
          setPassword={dispatchPassword}
          isLogin={authIsLogin}
          setIsLogin={dispatchIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: "#3498db",
    textAlign: "center",
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
