/*import React, { useContext } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { auth } from './firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';


const Stack = createNativeStackNavigator();

function LoginScreen() {
  const login = () => {
    signInWithEmailAndPassword(auth, "test@example.com", "123456")
      .catch(() => alert("Login failed"));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={login} />
    </View>
  );
}

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
*/
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppNavigator from './Appnavigator'; // put your navigator in a separate file

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
