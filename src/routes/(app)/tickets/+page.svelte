<script>
  import { collection, getCountFromServer, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
  import { auth, db } from "../../../lib/firebase/firebase";
  import { onDestroy, onMount } from "svelte";
  import TicketDetails from "./TicketDetails.svelte";
  import Link from '../../../lib/components/Link.svelte';
  import { userAuth } from '../../../store/authStore';
  import Badge from "./Badge.svelte";

  // Initialize isAdmin as false
  let isAdmin = false;
  let userTicketsCollectionRef;
  let uid;

  // Function to check admin status
  const checkAdminStatus = async () => {
    try {
      const adminsCollectionRef = collection(db, 'admins');
      const adminsSnapshot = await getDocs(adminsCollectionRef);
      
      // Check if the current user's UID exists in the admins collection
      isAdmin = adminsSnapshot.docs.some(doc => doc.id === auth.currentUser.uid);
    } catch (error) {
      console.error('Error checking admin status:', error.message);
    }
  };

  // Get the user's UID from the store


  // Collection reference for user's tickets

  // Array to store ticket data
  let data = [];

  // State for displaying ticket details modal
  let showModal = false;

  // State for storing selected ticket
  let selectedTicket;

  // Function to show ticket details
  function showTicketDetails(ticket) {
    selectedTicket = ticket;
    showModal = !showModal;
  }

  // Function to get real-time updates for all tickets
  const subscribeToAllTickets = () => {
    const ticketsCollectionRef = collection(db, 'users');

    const unsubscribe = onSnapshot(ticketsCollectionRef, (snapshot) => {
      // Reset data and update with new ticket data
      data = snapshot.docs.map((doc) => doc.data());
    });

    // Return the unsubscribe function to stop listening when needed
    return unsubscribe;
  };

  // Subscription variable for onSnapshot
  let unsubscribe;

  onMount(async () => {
    // Check admin status
    await checkAdminStatus();
    if (auth.currentUser) {
      uid = auth.currentUser.uid;
      console.log("User ID: ", uid);

      // Create user-specific tickets collection reference
      userTicketsCollectionRef = collection(db, 'users', uid, 'tickets');
    }

    // Subscribe to all tickets if the user is an admin
    if (isAdmin) {
      unsubscribe = subscribeToAllTickets();
    } else {
      // Query user's tickets and update data
      const q = query(userTicketsCollectionRef, orderBy('createdAt', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        data = snapshot.docs.map((doc) => doc.data());
      });
    }
  });

  onDestroy(() => {
    // Unsubscribe when the component is destroyed
    
  });

  // Function to get the count of tickets based on status
  async function getCountByStatus(status, ref = userTicketsCollectionRef) {
    const q = status ? query(ref, where("status", "==", status)) : query(ref);
    const totalTickets = await getCountFromServer(q);
    return totalTickets.data().count;
  }

  // Array of metrics with their corresponding labels, queries, and state classes
  let metrics = [
    { label: "Tickets", query: async () => getCountByStatus(), stateClass: "" },
    { label: "Pending", query: async () => getCountByStatus("pending"), stateClass: "pending" },
    { label: "In Progress", query: async () => getCountByStatus("in progress"), stateClass: "in" },
    { label: "Completed", query: async () => getCountByStatus("completed"), stateClass: "completed" },
    { label: "Canceled", query: async () => getCountByStatus("canceled"), stateClass: "canceled" },
  ];
</script>



<section>
<TicketDetails ticket = {selectedTicket} show={showModal} />
  <div class="title">
    <h1>Tickets</h1>
    <p>Manage all your Properties Maintenance Tickets</p>
    <Link to="/tickets/add" text='Add Ticket'/>
  </div>

  <h2>Maintenance Tickets</h2>

  <div class="status-badges">
    {#if uid}
      {#each metrics as { label, query }}
        {#await query()}
          <Badge label={label} loading={true}  />
          {:then num}
          <Badge label={label} num={num}  />
        {/await}
      {/each}
    {/if}
  </div>
  
  <table>
      <thead>
          <tr>
              <th>Tickets</th>
              <th>Address</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
          </tr>
      </thead>
      <tbody>
        {#each data as ticket}
          <tr class="{ticket.status}" on:click={() => showTicketDetails(ticket)}>
            <td class="t-text">
              <i class="fa-regular fa-file-lines"></i>
              <p class="ticket-text">{ticket.issue}<br>
              <span class="submit-badge">Submitted by {ticket.tenant_email}</span></p>
            </td>
            <td>{ticket.address}</td>
            <td>{ticket.category}</td>
            <td>{ticket.priority}</td>
            <td>{ticket.status}</td>
          </tr>
        {/each}
      </tbody>

  </table>



</section>


<style>

  tr {
    cursor: pointer;
  }

  tr:hover {
    transform: scale(1.005);
  }

  td::first-letter {
    text-transform: capitalize;
  }

  .status-badges {
    display: flex;
    gap: 10px;
  }

  .pending {
  background-color: rgba(49, 49, 49, 0.15) !important;
}

.in {
  background-color: rgba(255, 221, 0, 0.15) !important;
}

.completed {
  background-color: rgba(0, 253, 0, 0.15) !important;
}

.canceled {
  background-color: rgba(255, 0, 0, 0.1) !important;
}


  .t-text {
    display: flex;
    gap: 1em;
    align-items: center;
  }

  .t-text > p {
    font-size: 1em;
    margin: 0;
    font-weight: 500;
    color: rgb(0, 0, 0);

  }

  p > span, td, th {
    color: rgba(0, 0, 0, 0.601);
  }

  .fa-regular {
    background-color: rgba(0, 0, 0, 0.05);
    padding: .5em .7em;
    border-radius: 50%;
    color: rgba(0, 0, 0, 0.7);
    font-size: 1.5em;
  }

  table {
    width: 100%;
    text-align: left;

  }

  td, th {
    position: relative;
    padding: .7em 1em;
    border: none;
    border-bottom: 5px solid white;
  }

  table { border-spacing: 0;}

  section {
    padding: 1em 2em;
  }



  h1, h2, p {
    margin: 0;
  }

  h2 {
    font-size: 1.2em;
    font-weight: 600;
  }

  p {
    font-size: .8em;
    margin: .5em 0 0 0;

  }

  .title {
    font-size: 1.5em;
    text-align: center;
    padding: 1em 0;
    border-bottom: 1px solid rgba(0,0,0,.1);
    margin-bottom: 1em;
    text-align: left;
  }
  .row {
    display: flex;

  }



  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 2em;
    height: 1000px;
  }

  .v-line {
    border-right: 1px solid rgba(0, 0, 0, 0.1) ;
  }
</style>