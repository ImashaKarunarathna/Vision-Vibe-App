import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
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
  updateDoc,
} from 'firebase/firestore';
import { useTheme } from '../contexts/ThemeContext';
import { auth, db } from '../firebase'; // Make sure to import these properly

export default function DiaryScreen() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
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

    const diaryRef = collection(db, 'diary');
    const unsubscribe = onSnapshot(diaryRef, (snapshot) => {
      const userEntries = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((entry) => entry.userId === user.uid);
      setEntries(userEntries);
    });

    return unsubscribe;
  }, [user]);

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;
    await addDoc(collection(db, 'diary'), {
      text: newEntry,
      userId: user.uid,
      createdAt: new Date(),
    });
    setNewEntry('');
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'diary', id));
  };

  const handleUpdate = async (id) => {
    await updateDoc(doc(db, 'diary', id), { text: editingText });
    setEditingId(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.entry}>
      {editingId === item.id ? (
        <>
          <TextInput
            style={styles.entryInput}
            value={editingText}
            onChangeText={setEditingText}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleUpdate(item.id)}>
              <Text style={styles.save}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingId(null)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.entryText}>{item.text}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => {
                setEditingId(item.id);
                setEditingText(item.text);
              }}
            >
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

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
        <Text style={styles.heading}>📝 Your Diary</Text>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Write a new diary entry..."
            value={newEntry}
            onChangeText={setNewEntry}
            placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.entriesList}
        />
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
    inputSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      flexWrap: 'wrap',
    },
    input: {
      backgroundColor: theme === 'dark' ? '#222' : '#fff',
      padding: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#555' : '#aaa',
      flex: 1,
      marginRight: 10,
      color: theme === 'dark' ? '#eee' : '#000',
      minHeight: 40,
      textAlignVertical: 'top',
    },
    addButton: {
      backgroundColor: theme === 'dark' ? '#556' : '#2c3e50',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 6,
    },
    addText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    entriesList: {
      paddingTop: 10,
      paddingBottom: 40,
      width: '100%',
    },
    entry: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      padding: 12,
      marginBottom: 10,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 1 },
      shadowRadius: 2,
      elevation: 2,
    },
    entryText: {
      fontSize: 16,
      marginBottom: 5,
      color: theme === 'dark' ? '#eee' : '#000',
    },
    entryInput: {
      backgroundColor: theme === 'dark' ? '#444' : '#f9f9f9',
      padding: 8,
      borderRadius: 6,
      borderColor: theme === 'dark' ? '#666' : '#ccc',
      borderWidth: 1,
      marginBottom: 5,
      color: theme === 'dark' ? '#eee' : '#000',
      minHeight: 40,
      textAlignVertical: 'top',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
    },
    edit: {
      color: theme === 'dark' ? '#4db8ff' : '#007bff',
      marginRight: 15,
    },
    delete: {
      color: '#e74c3c',
    },
    save: {
      color: '#2ecc71',
      marginRight: 15,
    },
    cancel: {
      color: theme === 'dark' ? '#aaa' : '#999',
    },
  });
