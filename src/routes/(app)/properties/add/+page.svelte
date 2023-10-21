<script>
	import { goto } from '$app/navigation';
  import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
  import { db, storage } from "../../../../lib/firebase/firebase";
  import { ref } from "firebase/storage";


  let name = "";
  let tenant = "";
  let address = "";
  let building_type = "";
  let loading = false;
  let error = false;

  const newProp = async() => {
    const docData = {
      name: name,
      tenant,
      address: address,
      building_type: building_type,
      createdAt: Timestamp.now(),
    };

    const docRef = async() =>{
      return await addDoc(collection(db, "properties"), docData);
    }
    docRef()
    console.log("Document successfully written!", docRef.id);
    history.back()
  };

</script>

<a href="/properties">Back</a>

<form>
  <label>
    <p class={name?'above':'center'}>Name</p>
    <input bind:value={name} type="text" placeholder="Name" />
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
    <p class={building_type?'above':'center'}>Building Type</p>
    <input bind:value={building_type} type="text" placeholder="Building Type" />
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