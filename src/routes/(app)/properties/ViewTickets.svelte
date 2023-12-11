<script>
	import { db } from './../../../lib/firebase/firebase.js';
	import { onMount } from 'svelte';
  import { collection, query, where, getDocs } from 'firebase/firestore';

  export let propertyId;
  
  let tickets = [];

  const loadTickets = async () => {
    try {
      const q = query(collection(db, 'tickets'), where('propertyId', '==', propertyId));
    
      const querySnapshot = await getDocs(q);

      tickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  
      }));
    } catch (err) {
      console.log(err);
    }
  };

  onMount(async () => {
    await loadTickets();
    console.log(tickets)
  });

  
</script>

<div class="tickets">

  <h2 class="title">Tickets</h2>

  {#await loadTickets()}
    <p class="loading">Fetching tickets...</p> 
  {:then}

    {#if tickets.length === 0}
      <p class="no-tickets">No tickets found</p>
    {:else}
      {#each tickets as ticket}
        <div class="ticket">
          <h3 class="issue">{ticket.issue}</h3>
          <div class="address">
            {ticket.address}  
          </div>
          <div class="meta">
            <span class="tenant">by {ticket.tenant_email}</span>
            <br><span class="date">at {new Date(ticket.createdAt.toDate()).toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })} 
      {new Date(ticket.createdAt.toDate()).toLocaleDateString()}
      </span>
          </div>

          

        </div>
      {/each}
    {/if}

  {/await}

</div>

<style> .tickets { max-width: 800px; margin: 0 auto; } .title { text-align: center; } .ticket { padding: 1em; background: #fff; box-shadow: 1px 1px 3px rgba(0,0,0,0.1); margin-bottom: 0.5em; } .meta, .address { font-size: 0.85em; color: #888; } </style>