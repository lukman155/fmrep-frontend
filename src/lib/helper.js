
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";


export const checkAdminStatus = async () => {
  try {
      const adminsCollectionRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsCollectionRef);
    // Check if the current user's UID exists in the admins collection
      return adminsSnapshot.docs.some(doc => doc.id === auth?.currentUser?.uid)
  } catch (error) {
    console.error('Error checking admin status:', error.message);
  }
};

export function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

