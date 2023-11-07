<!-- Badge.svelte -->
<script>
  export let label;
  export let num;
  export let loading;
  let stateClass = label.toLowerCase();
</script>

  <span class="badge {stateClass}">
    {#if loading}
      Loading
    {:else}
      {label}
      {#if num != 'pine'}
      : {num}
      {/if}
    {/if}
  </span>

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
