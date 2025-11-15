// src/App.jsx
import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

function App() {
  const [plants, setPlants] = useState([]);

  // 🔹 1. Write test – runs when you click the button
  async function handleTestWrite() {
    try {
      const docRef = await addDoc(collection(db, "testPlants"), {
        name: "Test Plant",
        createdAt: serverTimestamp(),
      });
      console.log("✅ Wrote doc with ID:", docRef.id);
    } catch (err) {
      console.error("❌ Error writing doc:", err);
    }
  }

  // 🔹 2. Read test – runs once on page load
  useEffect(() => {
    async function loadPlants() {
      try {
        const snap = await getDocs(collection(db, "testPlants"));
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("✅ Read docs:", data);
        setPlants(data);
      } catch (err) {
        console.error("❌ Error reading docs:", err);
      }
    }

    loadPlants();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>Plant Dashboard – Firestore Test</h1>

      <button onClick={handleTestWrite}>Test Firestore Write</button>

      <h2>Test Plants (from Firestore)</h2>
      <ul>
        {plants.map((p) => (
          <li key={p.id}>
            {p.name || "Unnamed"} – {p.id}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default App
