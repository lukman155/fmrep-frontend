<script>
  import SideMenu from "../SideMenu.svelte";

  let expanded = true;

  function toggleMenu() {
    expanded = !expanded;
  } 

</script>

<div class="container">

  <div class="sidebar-con" class:expanded>
    <div class="sidebar" class:expanded>
      <SideMenu />
    </div>

    <div class="menu-toggle" class:expanded>
      <button on:click={toggleMenu}>
        {#if expanded}
        <i class="fa-solid fa-angles-left"></i> 
        {:else}
        <i class="fa-solid fa-bars-staggered"></i> 
        {/if}
      </button>
    </div>

  </div>

  <div class="content">
    <slot />
  </div>


</div>

<style>

  .menu-toggle {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;  
  }

  .menu-toggle.expanded {
    right: -30px;
    left: auto;
  }
  .menu-toggle button { 
    height: 100vh;
    width: 30px;
    background-color: white;
    border-top: none;
    border-bottom: none;
    border-left: 1px solid rgba(0, 0, 0, 0.267);
    border-right: 1px solid rgba(0, 0, 0, 0.267);
  }

  .menu-toggle button:hover { 
   
    border-left: 1px solid rgba(0, 0, 0, 0.5);
    border-right: 1px solid rgba(0, 0, 0, 0.5);
  }


.sidebar {
    height: 100%;
    transition: width 0.2s; 
  }


  .sidebar:not(.expanded) {
    width: 0;
    display: none;
  } 

.container {
  display: flex;
  height: 100%;
}

.sidebar-con {
  position: relative;
  height: 100%;

}
.sidebar-con.expanded {
  position: relative;
  height: 100%;
  width: auto;
}
.sidebar-con {
  width: 25px;
}

.content {
  flex-grow: 1;
  overflow: auto;
  padding-left: 30px;
}


</style>