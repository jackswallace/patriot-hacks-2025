import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  User,
  Mail,
  Calendar,
  Leaf,
  Clock,
  CreditCard,
  Moon,
  Bell,
  Wifi,
  LogOut,
  Edit2,
} from 'lucide-react';

export function Profile() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState('');
  const [accountCreated, setAccountCreated] = useState('');
  const [plantCount, setPlantCount] = useState(0);
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        setAccountCreated(user.metadata.creationTime);

        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(`${data.firstName} ${data.lastName}`);
          } else {
            setUserName('No name set');
          }

          try {
            const userPlantsRef = collection(db, 'users', user.uid, 'plants');
            const userPlantsSnap = await getDocs(userPlantsRef);
            if (!userPlantsSnap.empty) {
              setPlantCount(userPlantsSnap.size);
            } else {
              const ownerFields = ['ownerId', 'ownerUID', 'userId', 'owner', 'createdBy'];
              let found = false;

              for (const field of ownerFields) {
                const q = query(collection(db, 'plants'), where(field, '==', user.uid));
                const snap = await getDocs(q);
                if (!snap.empty) {
                  setPlantCount(snap.size);
                  found = true;
                  break;
                }
              }

              if (!found && user.email) {
                const emailFields = ['ownerEmail', 'email', 'createdBy'];
                for (const field of emailFields) {
                  const q = query(collection(db, 'plants'), where(field, '==', user.email));
                  const snap = await getDocs(q);
                  if (!snap.empty) {
                    setPlantCount(snap.size);
                    found = true;
                    break;
                  }
                }
              }

              if (!found) {
                const allSnap = await getDocs(collection(db, 'plants'));
                setPlantCount(allSnap.size > 0 ? allSnap.size : 0);
              }
            }
          } catch (innerErr) {
            console.error('Error fetching plants:', innerErr);
            setPlantCount(0);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
        setLoading(false); // Finished loading
      } else {
        setLoading(false); // Finished loading
        navigate('/login'); // Redirect if not logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-offWhite to-sand">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-darkForest mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-sage to-olive rounded-full flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-darkForest mb-1">{userName || 'Loading...'}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Mail className="w-4 h-4" />
                <span>{userEmail || 'No user signed in'}</span>
              </div>
              <button
                onClick={() => navigate("/edit-profile")}
                className="flex items-center gap-2 bg-lightMoss text-olive px-4 py-2 rounded-lg font-medium hover:bg-sage hover:text-white transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Account Created */}
          <div className="bg-gradient-to-br from-white to-lightMoss/30 rounded-2xl shadow-md p-6 border border-sage/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-sage" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Account Created</h3>
            </div>
            <p className="text-2xl font-bold text-darkForest">
              {accountCreated ? new Date(accountCreated).toLocaleDateString() : '—'}
            </p>
          </div>

          {/* Connected Plants */}
          <div className="bg-gradient-to-br from-white to-lightMoss/30 rounded-2xl shadow-md p-6 border border-sage/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-olive/20 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-olive" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Connected Plants</h3>
            </div>
            <p className="text-2xl font-bold text-darkForest">
              {plantCount} {plantCount === 1 ? 'Plant' : 'Plants'}
            </p>
          </div>

          {/* Last Login */}
          <div className="bg-gradient-to-br from-white to-lightMoss/30 rounded-2xl shadow-md p-6 border border-sage/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-warmBrown/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warmBrown" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Last Login</h3>
            </div>
            <p className="text-2xl font-bold text-darkForest">
              {auth.currentUser?.metadata.lastSignInTime
                ? new Date(auth.currentUser.metadata.lastSignInTime).toLocaleString()
                : '—'}
            </p>
          </div>

          {/* Subscription Status */}
          <div className="bg-gradient-to-br from-white to-lightMoss/30 rounded-2xl shadow-md p-6 border border-sage/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-sage" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subscription</h3>
            </div>
            <p className="text-2xl font-bold text-darkForest mb-3">Pro Plan</p>
            <button
              onClick={() => navigate('/subscriptions')}
              className="w-full bg-olive text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-darkForest mb-6">Settings</h2>
          <div className="space-y-6">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold text-darkForest">Notifications</h3>
                  <p className="text-sm text-gray-600">Receive plant care alerts</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${notifications ? 'bg-sage' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Connect Devices */}
            <div className="py-4">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sage to-olive text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                <Wifi className="w-5 h-5" />
                Connect Devices
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-red-500 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
