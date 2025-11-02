// src/contexts/ThemeContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase"; // ✅ Import Firebase properly

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.theme) {
              setTheme(data.theme); // ✅ Optional: sync theme from Firestore
            }

            if (data.backgroundImage) {
              setBackgroundImage(data.backgroundImage);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user theme settings:", error);
        }
      } else {
        setBackgroundImage("");
        setTheme("light"); // Reset to default if no user
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, backgroundImage, setBackgroundImage }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
