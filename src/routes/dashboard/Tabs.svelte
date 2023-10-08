<script>
  let tabs = ['About', 'Tickets', 'Tenants'];
  let activeTab = tabs[0];
</script>

<div class="tab-container">
  <div class="tabs">
    {#each tabs as tab}
        <div class='tab {activeTab === tab ? "active" : ""}' on:click={() => activeTab = tab}>
          {tab}
        </div>
    {/each}
  </div>
</div>
<div class="tab-content">
  {#if activeTab == 'About'}
  <div class="field">
  <p>Property type</p>
  <p>Residential</p>

  </div>
  <div class="field">
  <p>Status</p>
  <p>Rented</p>

  </div>
  <div class="field">
  <p>Monthly Payment</p>
  <p>100K</p>

  </div>
  <div class="field">
  <p>Currently Renting</p>
  <p>Mr Dennis</p>
  </div>
  <div class="field">
  <p>Lease Period</p>
  <p>2 Years</p>
  </div>
  {/if}


  {#if activeTab == 'Tickets' }
  <p>Loading...</p>
  {/if}

  {#if activeTab == 'Tenants' }
  <p>Loading Profile</p>
  {/if}
</div>

<style>
  .tab-container {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .tabs {
    display: flex;
  }

  .tab {
    font-size: .8em;
    padding: 10px;
    cursor: pointer;
  }

  .active {
    font-weight: 600;
    border-bottom: 1px solid #000000;
  }

  .field {
    display: flex;
    justify-content: space-between;
  }

  .field > :nth-child(1) {
    font-size: .8em;
  }

  .field > :nth-child(2) {
    font-size: .8em;
    font-weight: 600;
  }
</style>