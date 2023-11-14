<!-- src/components/Announcement.svelte -->
<script>
  import { onDestroy, onMount } from 'svelte';
  import {
    Timestamp,
    addDoc,
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
  } from 'firebase/firestore';
  import { auth, db } from '../../../lib/firebase/firebase';

  let data = [];
  let title = '';
  let content = '';
  let isAdmin = false;

  function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  const checkAdminStatus = async () => {
    try {
      const adminsCollectionRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsCollectionRef);

      // Check if the current user's UID exists in the admins collection
      isAdmin = adminsSnapshot.docs.some((doc) => doc.id === auth.currentUser.uid);
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

  onMount(() => {
    checkAdminStatus();
    const collectionRef = collection(db, 'announcements');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));
    unsubscribe = onSnapshot(q, (snapshot) => {
      data = snapshot.docs.map((doc) => {
        const announcementData = doc.data();
        const createdAt = announcementData.createdAt.toDate();
        return { ...announcementData, createdAt };
      });
    });
  });

  onDestroy(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
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
    {#each data as { title, content, createdAt }}
    <li>
      <h3>{title}</h3>
      <p>{content}</p>
      <p>Created at: {formatDate(createdAt)}</p>
    </li>
    {/each}
  </ul>
</div>


<style>
  /* Add your styles here or link an external stylesheet */

  div {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    font-size: 28px;
    margin-bottom: 20px;
  }

  form,
  ul {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    box-sizing: border-box;
  }

  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #45a049;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    border: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  h3 {
    color: #333;
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
</style>

