<script>
  import SideMenu from "../SideMenu.svelte";

</script>

<div class="container">


  <div class="sidebar">
    <SideMenu />
  </div>

  <div class="content">
    <slot />
  </div>

</div>

<style>

.container {
  display: flex;
  height: 100%;

}
.sidebar {
  height: 100%;
}

.content {
  flex-grow: 1;
  overflow: auto;
}
</style>