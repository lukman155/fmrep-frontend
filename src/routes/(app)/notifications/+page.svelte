<!-- src/components/Announcement.svelte -->
<script>
  import { onDestroy, onMount } from 'svelte';
  import { Timestamp, addDoc, collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
  import { db } from '../../../lib/firebase/firebase';

  
  let data = []
  let title = '';
  let content = '';

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

  <ul>
    {#each data as announcement}
      <li>
        <h3>{announcement.title}</h3>
        <p>{announcement.content}</p>
      </li>
    {/each}
  </ul>
</div>
