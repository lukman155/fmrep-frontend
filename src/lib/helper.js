
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../lib/firebase/firebase";


export const checkAdminStatus = async () => {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    // Check if the current user's UID exists in the admins collection
      return adminsSnapshot.docs.some(doc => doc.id === auth?.currentUser?.uid)
  } catch (error) {
    console.error('Error checking admin status:', error.message);
  }
};
