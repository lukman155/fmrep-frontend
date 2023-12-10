<script>
	import TextArea from './../../../../lib/components/TextArea.svelte';
	import InputField from './../../../../lib/components/InputField.svelte';
	import { maintenanceCategories, statusOptions, priorityOptions } from './options.js';
	import { getDocs } from 'firebase/firestore';
	import { query } from 'firebase/firestore';
  import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
  import { auth, db } from '../../../../lib/firebase/firebase';

  export let active_step;

  let selectedCategory = '';
  let uploading = false

	let formData = {
    issue: ''.toLowerCase(),
    address: ''.toLowerCase(),
    description: ''.toLowerCase(),
    status: 'Pending'.toLowerCase(),
    priority: 'Low'.toLowerCase(),
    category: selectedCategory.toLowerCase(),
	}

  const newProp = async () => {
  if (uploading) {
    return;
  }

  const docData = {
    ...formData,
    createdAt: Timestamp.now(),
    tenant_uid: auth.currentUser.uid,
    tenant_email: auth.currentUser.email,
  };

  try {
    uploading = true;

    // Reference to the 'tickets' collection with automatic document ID generation
    const ticketsRef = collection(db, 'tickets');

    // Use addDoc for automatic document ID generation
    const newTicketRef = await addDoc(ticketsRef, docData);

    console.log('Document written with ID:', newTicketRef.id);
    uploading = false;
    history.back();
  } catch (error) {
    console.error('Error adding document:', error.message);
  }
};

</script>
<form class="form-container" on:submit={newProp}>
	
  {#if active_step == 'Category'}

  <label>Select a Maintenance Category:
    <div class="cat-con">
      {#each maintenanceCategories as { category, src }}
        <div class="cat-tile">
          <input
            type="radio"
            id={category}
            name="category"
            bind:group={selectedCategory}
            value={category}
            class:selected={selectedCategory === category}
            required
          >
          <label for={category}>
            <img src=/{src} alt={category}>
            <p>{category}</p>
          </label>
        </div>
      {/each}
    </div>
    
  </label>

	{:else if active_step == 'Details'}
  <div class="details-step">

    <InputField label={'Issue*'} bind:value={formData.issue} required/>
    <InputField label={'Address*'} bind:value={formData.address} required/>

    <TextArea label={'Description'} bind:value={formData.description}/>



    <div class="side">

      <label for="priority">
        <p>Select Priority:</p>
        <select id="priority" bind:value={formData.priority}>
          {#each priorityOptions as option (option)}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </label>
      
      <label for="status">
        <p>Select Status:</p>
        <select id="status" bind:value={formData.status}>
          {#each statusOptions as option (option)}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </label>

    </div>

    

  </div>

  {:else if active_step == 'Confirmation'}

		<div class="con-step">
      <p>Please take a moment to review your ticket details before submitting.</p>
      <div class="details-card">
        <h3>Ticket Details:</h3>
        <p><strong>Category:</strong> {selectedCategory}</p>
        <p><strong>Issue:</strong> {formData.issue}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>Description:</strong> {formData.description}</p>
        <p><strong>Priority:</strong> {formData.priority}</p>
        <p><strong>Status:</strong>{formData.status}</p>
      </div>
      <div class="submit-btn">
        {#if selectedCategory && formData.issue.trim() !== '' && formData.address.trim() !== ''}
          <!-- Enable the button only when a category is selected, and issue and address have text -->
          
          <button  on:click={newProp}>Submit Ticket</button>
        {:else}
          <!-- Disable the button and show a message when conditions are not met -->
          <div>
            <p style="color: red;">
              {#if selectedCategory}
                Please enter text in both the issue and address fields before submitting.
              {:else}
                Please select a maintenance category before submitting.
              {/if}
            </p>
            <button  on:click={newProp} disabled>Submit Ticket</button>
          </div>
        {/if}
      </div>
		</div>

	{/if}
</form>

  <style>

    .submit-btn > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1em;
    }

    .submit-btn button {

    padding: 10px 20px;
    display: inline-block;
    color: black;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    
  }

  .submit-btn button:hover {
    color: rgb(30, 63, 29);
    border: 2px solid #499c4881;
    transform: scale(1.05);
  }

  .submit-btn button:disabled {
  /* Styles for disabled buttons */
  opacity: 0.5;
  color: rgba(0, 0, 0, 0.5);
}

.submit-btn button:disabled:hover {
    transform: scale(1);
  }

    .details-card > p {
      margin-bottom: 1em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.144);
    }

    select { 
      font-size: 1em;
      padding: 5px 10px;
      border-radius: 10px;
    }

    .side {
      display: flex;
      gap: 2em;
    }

    .submit-btn {
      align-self: center;
    }

    .details-card {
    border-radius: 10px; /* Adjust the radius for rounded edges */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Adjust the shadow as needed */
    padding: 20px; /* Add padding for spacing inside the card */
    background-color: #fff;
  }

  .details-card > h3 {
    text-align: center;
  }

    .form-container {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    }

    .con-step {
      width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    
    gap: 2em;
    }
  .details-step {
    width: 100%;
    max-width: 600px;
  }

    .selected {
      background-color: rgb(97, 215, 220);
    }

    .cat-con {
      display: flex;
      flex-wrap: wrap;
      gap: 1em;
      align-items: center;
      justify-content: center;
    }

    .cat-con > div {
      width: 9em;
      height: 9em;
    }

    .cat-tile {
      padding: 1em;
    }

    label, .cat-tile {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      width: 100%;
      height: 100%;

    }

    .cat-tile:has(.selected) {
      background-color: rgba(0, 0, 0, 0.09);
    }

    .cat-con > div > input {
      display: none;
    }

    p {
      margin: 0;
      width: 100%;

    }


  </style>