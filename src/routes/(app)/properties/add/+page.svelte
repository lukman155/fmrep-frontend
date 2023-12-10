<script>
	import { toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { auth } from './../../../../lib/firebase/firebase.js';
	import AddAssetForm from './AddAssetForm.svelte';
	import { addAsset } from './AddAssetForm.svelte';
	import InputField from './../../../../lib/components/InputField.svelte';
  import { addDoc, collection, Timestamp } from "firebase/firestore";
  import { db, storage } from "../../../../lib/firebase/firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

  let name = "";
  let address = "";
  let description = "5 units of 3-bedroom bungalow with BQ and some blah blah blah";
  let propertyImageFile = null;
  let loading = false;
  let error = false;
  let adminId;



  // Fields for adding assets
  let assets = [{ id: 0, name: "", description: "", imageFiles: [] }]; // Initial array with one empty asset

  const handlePropertyImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      propertyImageFile = file;
    }
  };

  const addPropertyAndAssets = async () => {
    if(!name || !address) {
    alert('Name and address required');
    return; 
  }
    try {
      
      loading = true;

      // Upload the property image to Firebase Storage
      let propertyImageUrl = null;
      if (propertyImageFile) {
        const propertyImageRef = ref(storage, `property_images/${name}_${Date.now()}`);
        await uploadBytes(propertyImageRef, propertyImageFile);
        propertyImageUrl = await getDownloadURL(propertyImageRef);
      }
      adminId = auth.currentUser.uid;


      // Add property data to Firestore
      const propertyData = {
        name: name,
        address: address,
        description: description,
        imageUrl: propertyImageUrl,
        createdAt: Timestamp.now(),
        adminId,
      };

      const propertyRef = await addDoc(collection(db, "properties"), propertyData);
      const propertyId = propertyRef.id;

      // Add each asset to Firestore

      await addAsset(propertyId)
      loading = false;
      goto('/properties')

      toast.push('Property created successfully', {classes:['toast-success']})
      // Additional actions after adding property and assets
    } catch (error) {
      toast.push('Error: Property not created', { classes: ['toast-error'] });
      console.error("Error adding property and assets:", error.message);
      loading = false;
      error = true;
    }
  };

</script>


<section>

<a href="/properties">Back</a>


<form>
  <InputField label={'Name*'} bind:value={name} required />
  <InputField label={'Address*'} bind:value={address} required />
  <InputField label={'Description'} bind:value={description} />

  <!-- Input field for selecting property image -->
  <label for="propertyImageInput">Select Property Image:</label>
  <input type="file" id="propertyImageInput" accept="image/*" on:change={handlePropertyImageChange} class="file-input" />


  <AddAssetForm ></AddAssetForm>

  <button class="submit-btn" on:click={addPropertyAndAssets} on:submit={addPropertyAndAssets}>
    {#if error}
      Try Again
    {:else if loading}
      <i class="fa-solid fa-spinner spin"></i>
    {:else}
      Submit
    {/if}
  </button>
</form>
</section>


<style>

  section {
    padding: 2em 1em;
  }
  form {
    max-width: 600px;
    margin: 0 auto;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input, textarea, select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .file-input {
    display: block;
    margin-top: 5px;
  }

  .asset-container {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
  }

  .asset {
    margin-bottom: 10px;
  }



  .asset img {
    max-width: 100px;
    margin-top: 5px;
  }

  .submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn:hover {
    background-color: #45a049;
  }

  .fa-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>