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
  import InputField from '../../../lib/components/InputField.svelte';
  import TextArea from '../../../lib/components/TextArea.svelte';

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
    <InputField bind:value={title} label='Title' />

    <TextArea bind:value={content} label='Content'/>

    <button type="submit">Add Announcement</button>
  </form>
  {/if}

  <ul>
    {#each data as { title, content, createdAt }}
    <li>
      <h3>{title}</h3>
      <p>{content}</p>
      <sub>Sent at: {formatDate(createdAt)}</sub>
    </li>
    {/each}
  </ul>
</div>


<style>
  h3::first-line{
    text-transform: capitalize;
  }
  sub {
    display: block;
    text-align: right;
    font-size: .8em;
    color: #666;
  }
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

  button {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 10px;
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
    border-radius: 15px;
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
  }
</style>

