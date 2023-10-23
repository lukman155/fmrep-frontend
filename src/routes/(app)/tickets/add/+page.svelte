<script>
	import { userAuth, x } from './../../../../store/authStore.js';
	import { goto } from '$app/navigation';
  import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
  import { auth, db, storage } from "../../../../lib/firebase/firebase";
  import { ref } from "firebase/storage";
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';


  let y;
  x.subscribe ((value) => {
    y = value})

  let selectedStatus = 'Pending';
  let ticket_name = 'Ticket'+ ' ' + y ;
  let tenant = "Sami";
  let address = "no" + ' ' + y;
  let category = "category" + ' ' + y;
  let priority = "high";
  let loading = false;
  let error = false;
  let userData;

  const statusOptions = [
    'Pending',
    'In Progress',
    'Completed',
    'Canceled',
  ];

const unsubscribe = userAuth.subscribe((user) => {
    if (user) {
      userData = user
      console.log(userData)
    } else {
      console.log('no user new')
    }
  });


  const newProp = async() => {
    const docData = {
      ticket_name,
      tenant:userData.email,
      address,
      category,
      priority,
      createdAt: Timestamp.now(),
      uid:userData.uid,
    };
    
    await addDoc(collection(db, "tickets"), docData);
    console.log("Document written");
    history.back()
    x.update((x) => x + 1)
  };

</script>

<a href="/tickets">Back</a>

<form>
  <label>
    <p class={ticket_name?'above':'center'}>ticket_name</p>
    <input bind:value={ticket_name} type="text" placeholder="ticket_name" />
  </label>

  <label>
    <p class={address?'above':'center'}>Address</p>
    <input bind:value={address} type="text" placeholder="Address" />
  </label>

  <label>
    <p class={category?'above':'center'}>Category</p>
    <input bind:value={category} type="text" placeholder="Category" />
  </label>

  <label>
    <p class={priority?'above':'center'}>priority</p>
    <input bind:value={priority} type="text" placeholder="priority" />
  </label>

  <label for="status">Select Status:</label>
  <select id="status" bind:value={selectedStatus}>
    <option value="">Select Status</option>
    {#each statusOptions as option (option)}
      <option value={option}>{option}</option>
    {/each}
  </select>
  

  <button class="submit-btn" on:click={newProp} on:submit={newProp}>
    {#if error}
      Try Again
    {:else if loading}
      <i class="fa-solid fa-spinner spin"></i>
    {:else}
      Submit
    {/if}
  </button>
</form>

Add properties