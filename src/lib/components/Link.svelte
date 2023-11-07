<script>
  export let to = "#"; // Default link target
  export let text = "Link Text";
</script>

<a href={to}>{#if text == 'Back'}<i class="fas fa-arrow-left"></i> {/if}{text}</a>


<style>


  a {
    display: inline-block;
    color: black;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }

  a:hover {
    color: rgb(30, 63, 29);
    border: 2px solid #499c4881;
    transform: scale(1.05);
  }
</style>