<script>
  import { collection, query, where, getDocs } from 'firebase/firestore';

  export let propertyId;
  
  let tickets = [];

  const loadTickets = async () => {
    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(ticketsRef, where('propertyId', '==', propertyId));
      
      const querySnap = await getDocs(q);

      tickets = querySnap.docs.map(doc => doc.data());
    } catch(err) {
      console.log(err);
    }
  };

  $: if (propertyId) {
    loadTickets(); 
  }
</script>

<div>
  <h2>Tickets</h2>
  
  {#if tickets.length === 0}
    <p>No tickets found</p>
  {:else}
    <ul>
      {#each tickets as ticket}
        <li>
          {ticket.title} - {ticket.status}
        </li>
      {/each}  
    </ul>
  {/if}

</div>