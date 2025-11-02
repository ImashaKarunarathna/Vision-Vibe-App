import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      navigation.navigate('Login'); // Redirect to login
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.brand}>Vision Vibe</Text>

      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.link}>Diary</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('VisionBoard')}>
          <Text style={styles.link}>Vision Board</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('CustomizeProfile')}>
          <Text style={styles.link}>Customize</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  brand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  navLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  link: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  logoutBtn: {
    borderColor: '#fff',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Navbar;
