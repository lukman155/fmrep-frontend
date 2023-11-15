<script context='module'>
	import { db, storage } from './../../../../lib/firebase/firebase.js';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { addDoc, collection, Timestamp } from 'firebase/firestore';
  import InputField from "../../../../lib/components/InputField.svelte";
  import TextArea from "../../../../lib/components/TextArea.svelte";


  let assets = [{ id: 0, name: "", description: "", imageFiles: [] }]; // Initial array with one empty asset

  const handleAssetImageChange = (event, assetId) => {
    const file = event.target.files[0];
    if (file) {
      assets = assets.map(asset => {
        if (asset.id === assetId) {
          return { ...asset, imageFiles: [...asset.imageFiles, file] };
        }
        return asset;
      });
    }
  };

  const addAnotherAsset = () => {
    assets = assets.map(asset => ({ ...asset })); // Deep copy the array
    assets.push({ id: assets.length, name: "", description: "", imageFiles: [] });
  };

  export const addAsset = async (propertyId) => {
    console.log("Adding Asset");
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
        propertyId: propertyId, // You need to define propertyId or import it from somewhere
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "assets"), assetData);
    }
  };
</script>

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
