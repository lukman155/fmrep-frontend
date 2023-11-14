<script>
  import { onMount } from 'svelte';
  import { addDoc, collection, Timestamp } from "firebase/firestore";
  import { db, storage } from "../../../../lib/firebase/firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

  let name = "";
  let address = "";
  let imageFile = null;
  let loading = false;
  let error = false;

  // Fields for adding assets
  let assets = [{ id: 0, name: "", description: "" }]; // Initial array with one empty asset

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      imageFile = file;
    }
  };

  const addPropertyAndAssets = async () => {
    try {
      loading = true;

      // Upload the image to Firebase Storage
      let imageUrl = null;
      if (imageFile) {
        const storageRef = ref(storage, `property_images/${name}_${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Add property data to Firestore
      const propertyData = {
        name: name,
        address: address,
        imageUrl: imageUrl,
        createdAt: Timestamp.now(),
      };

      const propertyRef = await addDoc(collection(db, "properties"), propertyData);
      const propertyId = propertyRef.id;

      // Add each asset to Firestore
      for (const asset of assets) {
        const assetData = {
          name: asset.name,
          description: asset.description,
          propertyId: propertyId,
          createdAt: Timestamp.now(),
        };

        await addDoc(collection(db, "assets"), assetData);
      }

      loading = false;
      // Additional actions after adding property and assets
    } catch (error) {
      console.error("Error adding property and assets:", error.message);
      loading = false;
      error = true;
    }
  };

  const addAnotherAsset = () => {
    assets = [...assets, { id: assets.length, name: "", description: "" }];
  };
</script>

<a href="/properties">Back</a>

<form>
  <!-- Fields for adding property -->
  <label for="propertyName">Name:</label>
  <input type="text" id="propertyName" bind:value={name} />

  <label for="propertyAddress">Address:</label>
  <input type="text" id="propertyAddress" bind:value={address} />

  <!-- Input field for selecting an image -->
  <label for="imageInput">Select Image</label>
  <input type="file" id="imageInput" accept="image/*" on:change={handleImageChange} />

  <!-- Fields for adding assets -->
  {#each assets as asset (asset.id)}
    <label for={`assetName${asset.id}`}>Asset Name:</label>
    <input type="text" bind:value={asset.name} id={`assetName${asset.id}`} />

    <label for={`assetDescription${asset.id}`}>Asset Description:</label>
    <textarea bind:value={asset.description} id={`assetDescription${asset.id}`}></textarea>

    {#if asset.id === assets.length - 1}
      <button type="button" on:click={addAnotherAsset}>Add Another Asset</button>
    {/if}
  {/each}

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
