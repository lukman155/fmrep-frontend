<script>
	import InputField from './../../../../lib/components/InputField.svelte';
  import { onMount } from 'svelte';
  import { addDoc, collection, Timestamp } from "firebase/firestore";
  import { db, storage } from "../../../../lib/firebase/firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import TextArea from '../../../../lib/components/TextArea.svelte';

  let name = "";
  let address = "";
  let propertyImageFile = null;
  let loading = false;
  let error = false;

  // Fields for adding assets
  let assets = [{ id: 0, name: "", description: "", imageFiles: [] }]; // Initial array with one empty asset

  const handlePropertyImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      propertyImageFile = file;
    }
  };

  const handleAssetImageChange = (event, assetId) => {
    const file = event.target.files[0];
    if (file) {
      assets = assets.map(asset => {
        if (asset.id === assetId) {
          return { ...asset, imageFiles: [...asset.imageFiles, file] };
        }
        return asset;
      });
      assets = assets
    }
  };

  const addPropertyAndAssets = async () => {
    try {
      loading = true;

      // Upload the property image to Firebase Storage
      let propertyImageUrl = null;
      if (propertyImageFile) {
        const propertyImageRef = ref(storage, `property_images/${name}_${Date.now()}`);
        await uploadBytes(propertyImageRef, propertyImageFile);
        propertyImageUrl = await getDownloadURL(propertyImageRef);
      }

      // Add property data to Firestore
      const propertyData = {
        name: name,
        address: address,
        imageUrl: propertyImageUrl,
        createdAt: Timestamp.now(),
      };

      const propertyRef = await addDoc(collection(db, "properties"), propertyData);
      const propertyId = propertyRef.id;

      // Add each asset to Firestore
      for (const asset of assets) {
        let assetImageUrls = [];
        for (const imageFile of asset.imageFiles) {
          const assetImageRef = ref(storage, `asset_images/${asset.name}_${Date.now()}`);
          await uploadBytes(assetImageRef, imageFile);
          const imageUrl = await getDownloadURL(assetImageRef);
          assetImageUrls.push(imageUrl);
        }

        const assetData = {
          name: asset.name,
          description: asset.description,
          imageUrls: assetImageUrls,
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
    assets = assets.map(asset => ({ ...asset })); // Deep copy the array
    assets.push({ id: assets.length, name: "", description: "", imageFiles: [] });
  };
</script>


<section>

<a href="/properties">Back</a>

<form>
  <InputField label={'Name'} bind:value={name} />
  <InputField label={'Address'} bind:value={address} />


  <!-- Input field for selecting property image -->
  <label for="propertyImageInput">Select Property Image:</label>
  <input type="file" id="propertyImageInput" accept="image/*" on:change={handlePropertyImageChange} class="file-input" />

  <!-- Fields for adding assets -->
  {#each assets as asset (asset.id)}
    <div class="asset-container">
      <InputField id={`assetName${asset.id}`} label={'Asset Name'} bind:value={asset.name} />
      <TextArea id={`assetDescription${asset.id}`} label={'Asset Description'} bind:value={asset.description}/>

      <!-- Input field for selecting asset images -->
      <label for={`assetImageInput${asset.id}`}>Select Asset Images:</label>
      <input type="file" id={`assetImageInput${asset.id}`} accept="image/*" multiple on:change={(e) => handleAssetImageChange(e, asset.id)} class="file-input" />

      <!-- Display selected asset images -->
      {#each asset.imageFiles as image (image)}
        <div class="asset">
          <img src={URL.createObjectURL(image)} alt="Asset" />
        </div>
      {/each}

      {#if asset.id === assets.length - 1}
        <button type="button" on:click={addAnotherAsset}>Add Another Asset</button>
      {/if}
    </div>
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