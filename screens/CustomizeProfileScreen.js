import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // import your firebase config properly

const themes = [
  { name: 'Mountains', img: require('../assets/mountainL.jpeg') },
  { name: 'Ocean', img: require('../assets/ocensl.jpeg') },
  { name: 'Forest', img: require('../assets/forestl.jpeg') },
  { name: 'Desert', img: require('../assets/desertl.jpeg') },
  { name: 'City', img: require('../assets/cityl.jpeg') },
];

export default function CustomizeProfileScreen() {
  const { theme, backgroundImage, setBackgroundImage, setTheme } = useTheme();
  const [customUrl, setCustomUrl] = useState('');
  const [user, setUser] = useState(null);
  const styles = getStyles(theme);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        loadBackground(u.uid);
      }
    });
    return unsubscribeAuth;
  }, []);

  const loadBackground = async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.backgroundImage) {
        setBackgroundImage(data.backgroundImage);
      }
    }
  };

  const saveBackground = async (imgUrl) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { backgroundImage: imgUrl }, { merge: true });
  };

  const handleSetCustomUrl = () => {
    if (customUrl.trim()) {
      setBackgroundImage(customUrl.trim());
      saveBackground(customUrl.trim());
      setCustomUrl('');
    } else {
      Alert.alert('Invalid URL', 'Please enter a valid image URL.');
    }
  };

  const handleSelectImage = (localImage) => {
    const uri = Image.resolveAssetSource(localImage).uri;
    setBackgroundImage(uri);
    saveBackground(uri);
  };

  const handleRemove = () => {
    setBackgroundImage('');
    saveBackground('');
  };

  return (
    <ImageBackground
      source={backgroundImage ? { uri: backgroundImage } : null}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🎨 Customize Your Profile</Text>

        <View style={styles.themeToggle}>
          <TouchableOpacity onPress={() => setTheme('light')} style={styles.themeBtn}>
            <Text style={styles.themeText}>🌞 Light Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTheme('dark')} style={styles.themeBtn}>
            <Text style={styles.themeText}>🌙 Dark Mode</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Choose a Theme Image:</Text>
        <View style={styles.gallery}>
          {themes.map((t) => (
            <TouchableOpacity key={t.name} onPress={() => handleSelectImage(t.img)}>
              <Image source={t.img} style={styles.themeImage} />
              <Text style={styles.imageLabel}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>Or Add Your Own Image URL:</Text>
        <TextInput
          placeholder="Enter image URL"
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
          value={customUrl}
          onChangeText={setCustomUrl}
          style={styles.input}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.setBtn} onPress={handleSetCustomUrl}>
            <Text style={styles.setBtnText}>Set Background</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeBtn} onPress={handleRemove}>
            <Text style={styles.setBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>

        {backgroundImage ? (
          <>
            <Text style={styles.previewLabel}>Current Background Preview:</Text>
            <Image source={{ uri: backgroundImage }} style={styles.previewImg} />
          </>
        ) : (
          <Text style={styles.noBackgroundText}>No background image set.</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)',
    },
    content: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      color: theme === 'dark' ? '#fff' : '#000',
      fontWeight: 'bold',
      marginBottom: 10,
    },
    themeToggle: {
      flexDirection: 'row',
      marginBottom: 15,
      gap: 10,
    },
    themeBtn: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      padding: 10,
      borderRadius: 6,
      marginRight: 10,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#ccc',
    },
    themeText: {
      color: theme === 'dark' ? '#eee' : '#333',
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 18,
      color: theme === 'dark' ? '#fff' : '#000',
      marginTop: 15,
      marginBottom: 8,
    },
    gallery: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'center',
      marginBottom: 20,
    },
    themeImage: {
      width: 100,
      height: 60,
      borderRadius: 6,
      marginBottom: 5,
    },
    imageLabel: {
      textAlign: 'center',
      color: theme === 'dark' ? '#eee' : '#000',
    },
    input: {
      backgroundColor: theme === 'dark' ? '#222' : '#fff',
      borderRadius: 6,
      padding: 10,
      width: '100%',
      marginBottom: 10,
      color: theme === 'dark' ? '#eee' : '#000',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#ccc',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 20,
    },
    setBtn: {
      backgroundColor: '#2196F3',
      padding: 10,
      borderRadius: 6,
    },
    removeBtn: {
      backgroundColor: '#f44336',
      padding: 10,
      borderRadius: 6,
    },
    setBtnText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    previewLabel: {
      color: theme === 'dark' ? '#fff' : '#000',
      marginBottom: 10,
      fontSize: 16,
    },
    previewImg: {
      width: '100%',
      height: 180,
      borderRadius: 10,
      marginBottom: 30,
    },
    noBackgroundText: {
      color: theme === 'dark' ? '#bbb' : '#666',
      marginTop: 20,
    },
  });
