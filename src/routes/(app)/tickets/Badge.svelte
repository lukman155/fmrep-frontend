<script>
  import { collection, getCountFromServer, query, where } from "firebase/firestore";
  import { auth, db } from "../../../lib/firebase/firebase";
  import { checkAdminStatus } from "../../../lib/helper";

  let uid = auth.currentUser.uid

  let isAdmin = false;
  isAdmin = checkAdminStatus;

  let ticketRef = collection(db, 'tickets' )

// Function to get the count of tickets based on status
async function getCountByStatus(status, ref = ticketRef) {
  const isAdmin = await checkAdminStatus(); // Assuming you have a function to check admin status
  let q;

  if (isAdmin) {
    // Admin can get count for all tickets
    q = status ? query(ref, where("status", "==", status)) : query(ref);
  } else {
    // Regular user gets count for their own tickets
    const currentUser = auth.currentUser;
    q = query(ref, where("tenant_uid", "==", currentUser.uid), where("status", "==", status));
  }

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


{#each metrics as { label, query, stateClass }}
  {#await query()}
    <span class="badge {stateClass}">
      {label}
    </span>
      {:then num}
    <span class="badge {stateClass}">
      {label}
        {#if num != 'pine'}
          : {num}
        {/if}
    </span>
  {/await}
{/each}



<style>
  .badge {
    width: fit-content;
    border-radius: 10px;
    padding: .4em .8em;
    background-color: rgba(255, 204, 0, 0.404);
    font-size: .7em;
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
</style>
