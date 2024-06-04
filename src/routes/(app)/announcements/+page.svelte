<!-- src/components/Announcement.svelte -->
<script>
  import { toast } from '@zerodevx/svelte-toast'
  import { onDestroy, onMount } from 'svelte';
  import {
    Timestamp,
    addDoc,
    collection,
    doc,
    deleteDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
  } from 'firebase/firestore';
  import { auth, db } from '../../../lib/firebase/firebase';
  import InputField from '../../../lib/components/InputField.svelte';
  import TextArea from '../../../lib/components/TextArea.svelte';
  import { checkAdminStatus, formatDate } from '../../../lib/helper';


  let allAnnouncements = [];
  let filteredAnnouncements = [];
  let title = '';
  let content = '';
  let isAdmin = false;
  let properties = [];
  let selectedPropertyForm = '';
  let selectedPropertyFilter = '';


  const addAnnouncement = async () => {
    if (title && content) {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        manager_email: auth.currentUser.email,
        createdAt: Timestamp.now(),
        manager_id: auth.currentUser.uid,
        property_id: selectedPropertyForm,
      });

      toast.push('Added Announcement Successfully', { classes: ['toast-success'] });

      title = '';
      content = '';
    }
  };


  const deleteAnnouncement = async (id) => {
    try {
      const announcementRef = doc(db, 'announcements', id);
      await deleteDoc(announcementRef);
      toast.push('Deleted Announcement Successfully', { classes: ['toast-warning'] });
    } catch (error) {
      console.error('Error deleting announcement:', error.message);
      toast.push('Error: Failed to delete announcement', { classes: ['toast-error'] });
    }
  };

  const filterAnnouncements = () => {
    if (selectedPropertyFilter) {
      filteredAnnouncements = allAnnouncements.filter(announcement => announcement.property_id === selectedPropertyFilter);
    } else {
      filteredAnnouncements = allAnnouncements;
    }
  };

  const getAnnouncements = async () => {
    try {
      const collectionRef = collection(db, 'announcements');
      const q = query(collectionRef, where('manager_id', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        allAnnouncements = snapshot.docs.map((doc) => {
          const announcementData = doc.data();
          const createdAt = announcementData.createdAt.toDate();
          return { id: doc.id, ...announcementData, createdAt };
        });
        filterAnnouncements();
      });
    }
    catch (error) {
      console.error('Error loading announcement:', error.message);
      toast.push('Error: Failed to load announcement', { classes: ['toast-error'] });
    }
  }
  let unsubscribe;

  const fetchProperties = async () => {
    try {
      const collectionRef = collection(db, 'properties');
      const q = query(collectionRef, where('manager_id', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error fetching properties:', err.message);
    }
  };


  onMount(async() => {
    isAdmin = await checkAdminStatus();
    getAnnouncements();
    fetchProperties();
    console.log(properties)
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
    <div>
      <label for="select">To:</label>
      <select bind:value="{selectedPropertyForm}">
        <option value="">All properties</option>
        {#each properties as property}
          <option value="{property.id}">{property.name}</option>
        {/each}
      </select>
    </div>
    
    <InputField bind:value={title} label='Title*' />
    <TextArea bind:value={content} label='Content*'/>
    <button type="submit">Add Announcement</button>
  </form>
  {/if}

  <select bind:value="{selectedPropertyFilter}" on:change={filterAnnouncements}>
    <option value="">All properties</option>
    {#each properties as property}
      <option value="{property.id}">{property.name}</option>
    {/each}
  </select>

  <ul>
    {#each filteredAnnouncements as { id, title, content, createdAt }}
    <li>
      <h3>{title}</h3>
      <p>{content}</p>
      <sub>Sent at: {formatDate(createdAt)}</sub>
  
      {#if isAdmin}
        <button on:click={() => deleteAnnouncement(id)}>Delete</button>
      {/if}
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

