import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");

      setEmail(user.email);

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSave = async () => {
    const user = auth.currentUser;

    try {
      if (email !== user.email) {
        await updateEmail(user, email);
      }

      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
      });

      navigate("/profile");

    } catch (err) {
      console.error(err);
      alert("Error updating profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offWhite to-sand">
      <Header />
      <main className="max-w-xl mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg mt-10">

        <h1 className="text-3xl font-bold text-darkForest mb-6">Edit Profile</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">First Name</label>
            <input
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveMist focus:border-oliveMist autofill:bg-white autofill:text-gray-900"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Last Name</label>
            <input
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveMist focus:border-oliveMist autofill:bg-white autofill:text-gray-900"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              className="w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveMist focus:border-oliveMist autofill:bg-white autofill:text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-sage hover:bg-olive text-white py-3 rounded-xl font-bold transition"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
