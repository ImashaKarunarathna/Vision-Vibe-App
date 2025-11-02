import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // <-- Import Firebase auth

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // Go to Home on successful signup
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require('../assets/Loginbg.mp4')} // Same video as Login
        rate={1.0}
        volume={1.0}
        isMuted
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Form Content */}
      <View style={styles.authContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Create your vision. Shape your reality!</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#555' }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 10, 20, 0.3)',
    zIndex: 1,
  },
  authContainer: {
    zIndex: 2,
    padding: 20,
    backgroundColor: 'transparent',
    marginTop: '30%',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    borderRadius: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#091436',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'serif',
    color: '#031124',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#60a8a8',
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#051429',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1d3557',
  },
  link: {
    color: '#457b9d',
    fontWeight: 'bold',
  },
});
