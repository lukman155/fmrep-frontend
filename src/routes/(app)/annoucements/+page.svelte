<!-- src/components/Announcement.svelte -->
<script>
  import { onDestroy, onMount } from 'svelte';
  import { Timestamp, addDoc, collection, getDocs, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
  import { auth, db } from '../../../lib/firebase/firebase';

  
  let data = []
  let title = '';
  let content = '';
  let isAdmin = false;

  const checkAdminStatus = async () => {
    try {
      const adminsCollectionRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsCollectionRef);
      
      // Check if the current user's UID exists in the admins collection
      isAdmin = adminsSnapshot.docs.some(doc => doc.id === auth.currentUser.uid);
    } catch (error) {
      console.error('Error checking admin status:', error.message);
    }
  };

  const addAnnouncement = async () => {
    if (title && content) {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        createdAt: Timestamp.now(),
      });
      title = '';
      content = '';
    }
  };
  let unsubscribe;
  const collectionRef = collection(db, 'announcements')

  onMount(()=> {
    checkAdminStatus();
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(10));
    unsubscribe = onSnapshot(q, (snapshot) => {
      const doc = snapshot.docs;
      data = [];
      doc.forEach((doc) => {
        data = [...data, doc.data()]
      });
    });
  })

  onDestroy(() => {
    unsubscribe;

  })

</script>

<div>
  <h1>Announcements</h1>

  {#if isAdmin}
  <form on:submit={addAnnouncement}>
    <label>
      Title:
      <input bind:value={title} />
    </label>
    <label>
      Content:
      <textarea bind:value={content}></textarea>
    </label>
    <button type="submit">Add Announcement</button>
  </form>
  {/if}

  <ul>
    {#each data as announcement}
      <li>
        <h3>{announcement.title}</h3>
        <p>{announcement.content}</p>
      </li>
    {/each}
  </ul>
</div>
