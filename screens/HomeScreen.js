import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase'; // ✅ Import auth correctly

export default function HomeScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Video */}
      <Video
        source={require('../assets/homebg.mp4')} // ✅ Ensure file exists
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.heading}>
            💫 Welcome to Your Dream Space 💫{'\n'}
            Let your heart guide your journey 🎈
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Diary')}>
            <Text style={styles.link}>1. Diary</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('VisionBoard')}>
            <Text style={styles.link}>2. Vision Board</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('CustomizeProfile')}>
            <Text style={styles.link}>3. Customize Your Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(1, 1, 44, 0.014)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    maxWidth: 400,
    width: '90%',
  },
  heading: {
    fontSize: 22,
    color: 'rgb(39, 8, 68)',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#00080c',
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 5,
    textDecorationLine: 'underline',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
