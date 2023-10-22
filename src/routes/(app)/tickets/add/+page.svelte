<script>
	import { userAuth, x } from './../../../../store/authStore.js';
	import { goto } from '$app/navigation';
  import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
  import { db, storage } from "../../../../lib/firebase/firebase";
  import { ref } from "firebase/storage";
  import { writable } from 'svelte/store';


  let y;
  x.subscribe ((value) => {
    y = value})
  let ticket_name = 'Ticket'+ ' ' + y ;
  let tenant = "Sami";
  let address = "no" + ' ' + y;
  let category = "category" + ' ' + y;
  let priority = "high";
  let loading = false;
  let error = false;

  const newProp = async() => {
    const docData = {
      ticket_name,
      tenant,
      address,
      category,
      priority,
      createdAt: Timestamp.now(),
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
    <p class={tenant?'above':'center'}>Tenant</p>
    <input bind:value={tenant} type="text" placeholder="Tenant" />
  </label>

  <label>
    <p class={category?'above':'center'}>Category</p>
    <input bind:value={category} type="text" placeholder="Category" />
  </label>

  <label>
    <p class={priority?'above':'center'}>priority</p>
    <input bind:value={priority} type="text" placeholder="priority" />
  </label>

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