import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';
import { auth, db } from '../firebase'; // Import correctly

export default function VisionBoardScreen() {
  const [goal, setGoal] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [date, setDate] = useState('');
  const [progress, setProgress] = useState('');
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const { theme, backgroundImage } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    const goalsRef = collection(db, 'visionGoals');

    const unsubscribe = onSnapshot(goalsRef, (snapshot) => {
      const userGoals = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((g) => g.userId === user.uid);
      setGoals(userGoals);
    });

    return unsubscribe;
  }, [user]);

  const handleAddGoal = async () => {
    if (!goal.trim()) return;

    await addDoc(collection(db, 'visionGoals'), {
      userId: user.uid,
      goal,
      imageURL,
      date,
      progress,
      createdAt: new Date(),
    });

    setGoal('');
    setImageURL('');
    setDate('');
    setProgress('');
  };

  const handleDeleteGoal = async (id) => {
    await deleteDoc(doc(db, 'visionGoals', id));
  };

  return (
    <ImageBackground
      source={backgroundImage ? { uri: backgroundImage } : null}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.heading}>🎯 Vision Board</Text>

        <View style={styles.inputGroup}>
          <TextInput
            placeholder="Goal"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
            value={goal}
            onChangeText={setGoal}
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
            value={imageURL}
            onChangeText={setImageURL}
            style={styles.input}
          />
          <TextInput
            placeholder="Date (e.g. 2025-12-31)"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Progress (e.g. 30%)"
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
            value={progress}
            onChangeText={setProgress}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
            <Text style={styles.addButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.goalsList} showsVerticalScrollIndicator={false}>
          {goals.map((g) => (
            <View key={g.id} style={styles.goalCard}>
              <Text style={styles.goalTitle}>{g.goal}</Text>
              {g.imageURL ? (
                <Image
                  source={{ uri: g.imageURL }}
                  style={styles.goalImage}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={styles.goalInfo}>📅 {g.date}</Text>
              <Text style={styles.goalInfo}>📈 Progress: {g.progress}</Text>
              <TouchableOpacity onPress={() => handleDeleteGoal(g.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
    },
    inner: {
      flex: 1,
      padding: 20,
      alignItems: 'center',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 10,
      color: theme === 'dark' ? '#eee' : '#000',
    },
    inputGroup: {
      width: '100%',
      maxWidth: 400,
      marginBottom: 20,
      gap: 10,
    },
    input: {
      backgroundColor: theme === 'dark' ? '#222' : '#fff',
      padding: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#ccc',
      fontSize: 16,
      color: theme === 'dark' ? '#eee' : '#000',
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: theme === 'dark' ? '#556' : '#2c3e50',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    goalsList: {
      width: '100%',
      maxWidth: 500,
    },
    goalCard: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      padding: 15,
      borderRadius: 8,
      marginBottom: 15,
      borderColor: '#ccc',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 1, height: 1 },
      elevation: 2,
    },
    goalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#eee' : '#000',
    },
    goalImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginTop: 10,
    },
    goalInfo: {
      marginTop: 8,
      fontSize: 14,
      color: theme === 'dark' ? '#ccc' : '#444',
    },
    deleteButton: {
      marginTop: 10,
      color: '#e74c3c',
      fontWeight: 'bold',
    },
  });
