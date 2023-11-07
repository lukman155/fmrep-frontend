<script>
  import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import InputField from './InputField.svelte';
  import { userAuth } from '../../../../store/authStore';
  import { db } from '../../../../lib/firebase/firebase';
	export let active_step;
	let formData = {
    issue: ''.toLowerCase(),
    address: ''.toLowerCase(),
    description: 'Ticket'.toLowerCase(),
    status: 'Pending'.toLowerCase(),
    category: ''.toLowerCase(),
    priority: 'Low'.toLowerCase(),
	}

  let selectedCategory = '';
  let userData = $userAuth;
  const handle = () => {
    console.log(userData)
  }




  const maintenanceCategories = [
  {
    category: "Plumbing",
    icon: "fa-wrench"
  },
  {
    category: "Electrical",
    icon: "fa-bolt"
  },
  {
    category: "HVAC (Heating, Ventilation, and Air Conditioning)",
    icon: "fa-temperature-high"
  },
  {
    category: "Appliances",
    icon: "fa-cogs"
  },
  {
    category: "General Repairs",
    icon: "fa-tools"
  },
  {
    category: "Pest Control",
    icon: "fa-bug"
  },
  {
    category: "Locks and Keys",
    icon: "fa-key"
  },
  {
    category: "Exterior Maintenance",
    icon: "fa-paint-roller"
  },
  {
    category: "Safety and Security",
    icon: "fa-shield-alt"
  },
  {
    category: "Painting",
    icon: "fa-paint-brush"
  },
  {
    category: "Carpentry",
    icon: "fa-hammer"
  },
  {
    category: "Mold or Mildew",
    icon: "fa-biohazard"
  }
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
    {#each maintenanceCategories as { category, icon }}
      <div class="cat-tile">
        <input type="radio" id={category} name="category" bind:group={selectedCategory} value={category} class:selected={selectedCategory === category} required>
        <label for={category}>
          <i class="fas {icon}"></i> <p>{category}</p>
        </label>
      </div>
    {/each}
  </div>
  </label>

	{:else if active_step == 'Details'}

  <InputField label={'Issue'} bind:value={formData.issue} />
		<InputField label={'Address'} bind:value={formData.address} />
		<InputField label={'Description'} bind:value={formData.description} />    
    
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


    {:else if active_step == 'Confirmation'}

		<div class="message">
			<h2>Thank you for choosing us</h2>
			<button on:click={() => handle()} class="btn submit">Finish </button>
		</div>

    
  <!-- <button class="submit-btn" on:click={newProp} on:submit={newProp}>
    {#if error}
      Try Again
    {:else if loading}
      <i class="fa-solid fa-spinner spin"></i>
    {:else}
      Submit
    {/if}
  </button> -->

	{/if}
</form>




  <style>

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

    .fas {
      font-size: 5em;
      width: 100%;
    }

  </style>