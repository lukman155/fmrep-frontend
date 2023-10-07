<script>
  import SideMenu from "./SideMenu.svelte";

</script>

<SideMenu />
<div class="wrapper">
  <slot />
</div>

<style>
  .wrapper {
    margin-left: 261px;
  }
</style>