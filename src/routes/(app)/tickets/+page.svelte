<script>
  import { collection, collectionGroup, doc, getCountFromServer, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
  import { auth, db } from "../../../lib/firebase/firebase";
  import { onMount } from "svelte";
  import TicketDetails from "./TicketDetails.svelte";
  import Link from '../../../lib/components/Link.svelte';
  import Badge from "./Badge.svelte";

  // Initialize isAdmin as false
  let isAdmin = false;
  let userTicketsRef;
  let uid;

  // Function to check admin status
  const checkAdminStatus = async () => {
    try {
      const adminsSnapshot = await getDocs(collection(db, 'admins'));
      // Check if the current user's UID exists in the admins collection
      isAdmin = adminsSnapshot.docs.some(doc => doc.id === auth.currentUser.uid);
    } catch (error) {
      console.error('Error checking admin status:', error.message);
    }
  };

  // Array to store ticket data
  let ticket_data = [];
  let ticket_users = [];

  // State for displaying ticket details modal
  let showModal = false;

  // State for storing selected ticket
  let selectedTicket;

  // Function to show ticket details
  function showTicketDetails(ticket) {
    selectedTicket = ticket;
    showModal = !showModal;
  }

const getUserTicket = async(ref) => {
  try {
    const querySnapshot = await getDocs(query(ref, orderBy('createdAt', 'desc')));
    ticket_data = querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching User Ticket Data:", error);
  }
}

  // Function to get real-time updates for all tickets
  const getAllTickets = async () => {
    
    const usersCollectionRef = collection(db, 'ticket_user');
    const usersSnapshot = await getDocs(usersCollectionRef);
    usersSnapshot.forEach((doc) => {
      // Access the data of each user document
      ticket_users.push(doc.id)
    });

    ticket_users.forEach((user) => {
      const ticketsCollectionRef = collection(db, 'users', user, 'tickets');
      const query = onSnapshot(ticketsCollectionRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Add a new document with data to our array
          ticket_data = [...ticket_data, doc.data()];
        })
      });
    })
};

  onMount(async () => {
    // Check admin status
    await checkAdminStatus();
    if (auth.currentUser) {
      uid = auth.currentUser.uid;
      userTicketsRef = collection(db, 'users', uid, 'tickets');
    }

    if (isAdmin) {
      getAllTickets();
    } else {
      getUserTicket(userTicketsRef)
    }
  });

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
    <Badge />
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
        {#each ticket_data as ticket, index}
          <tr class="{ticket.status}" on:click={() => showTicketDetails(ticket)} key={index}>
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