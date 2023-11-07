<script>
	import Button from './../../../../lib/components/Button.svelte';
  import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import InputField from './InputField.svelte';
  import { userAuth } from '../../../../store/authStore';
  import { db } from '../../../../lib/firebase/firebase';
	export let active_step;

  let selectedCategory = '';

	let formData = {
    issue: ''.toLowerCase(),
    address: ''.toLowerCase(),
    description: 'Ticket'.toLowerCase(),
    status: 'Pending'.toLowerCase(),
    priority: 'Low'.toLowerCase(),
	}

  let userData = $userAuth;
  const handle = () => {
    console.log(userData)
  }




  const maintenanceCategories = [
  { category: "Alarms and smoke detectors", src: "icons/Alarms and smoke detectors.svg" },
  { category: "Bathroom and Toilet", src: "icons/Bathroom and Toilet.svg" },
  { category: "Doors, Garages and Locks", src: "icons/Doors, Garages and Locks.svg" },
  { category: "Electricity", src: "icons/Electricity.svg" },
  { category: "Exterior and Garden", src: "icons/Exterior and Garden.svg" },
  { category: "Fire", src: "icons/Fire.svg" },
  { category: "Furniture", src: "icons/Furniture.svg" },
  { category: "Heater and boiler", src: "icons/Heater and boiler.svg" },
  { category: "Internal Floors", src: "icons/Internal Floors.svg" },
  { category: "Internet", src: "icons/Internet.svg" },
  { category: "Kitchen", src: "icons/Kitchen.svg" },
  { category: "Laundry", src: "icons/Laundry.svg" },
  { category: "Lighting", src: "icons/Lighting.svg" },
  { category: "Pests", src: "icons/Pests.svg" },
  { category: "Roof", src: "icons/Roof.svg" },
  { category: "Stairs", src: "icons/Stairs.svg" },
  { category: "Utility Meters", src: "icons/Utility Meters.svg" },
  { category: "Water and Leaks", src: "icons/Water and Leaks.svg" },
  { category: "Windows", src: "icons/Windoows.svg" },
  { category: "Other", src: "icons/Other.svg" }
];


  const statusOptions = [
    'pending',
    'in progress',
    'completed',
    'canceled',
  ];

  const priorityOptions = [
    'low',
    'medium',
    'high',
  ];
	

  const newProp = async() => {
    const docData = {
      ...formData,
      category: selectedCategory.toLowerCase(),
      createdAt: Timestamp.now(),
      tenant_uid: userData.uid,
      tenant_email: userData.email,
    };
    
    console.log(docData);

    await addDoc(collection(db, "tickets"), docData);
    console.log("Document written");
    history.back()
  };


</script>

<form class="form-container" on:submit={newProp}>
	
  {#if active_step == 'Category'}

  <label>Select a Maintenance Category:
    <div class="cat-con">
    {#each maintenanceCategories as { category, src }}
      <div class="cat-tile">
        <input type="radio" id={category} name="category" bind:group={selectedCategory} value={category} class:selected={selectedCategory === category} required>
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

    <InputField label={'Issue'} bind:value={formData.issue} />
    <InputField label={'Address'} bind:value={formData.address} />

    <label for="desc"> 
      <p>Description:</p>
      <textarea bind:value={formData.description} name="description" id="desc" cols="30" rows="10"></textarea>
    </label>

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
        <p><strong>Status:</strong> {formData.status}</p>
    </div>
      <div class="submit-btn">
        <Button color='green' bg-color='' text='Submit Ticket' clickHandler={() => handle()} />
      </div>
		</div>

	{/if}
</form>

  <style>

    .green {
      color: white !important;
      background-color: green !important;
      width: 10em;
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
    max-width: 800px;
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