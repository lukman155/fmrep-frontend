<script>
  import { onMount } from 'svelte';

  let menuItems = [
    { text: 'FMRepEx', link: '' },
    { text: 'Home', link: '', icon: 'fa-home' },
    { text: 'Dashboard', link: 'dashboard', icon: 'fa-dashboard' },
    { text: 'Properties', link: 'properties', icon: 'fa-house' },
    { text: 'Inbox', link: 'inbox', icon: 'fa-envelope' },
    { text: 'Notifications', link: 'notifications', icon: 'fa-bell' },
    { text: 'Leases', link: 'leases', icon: 'fa-file-contract' },
    { text: 'Tickets', link: 'tickets', icon: 'fa-ticket' },
    { text: 'Tenants', link: 'tenants', icon: 'fa-users' },
  ];
</script>

<div class="side-menu">
  <div class="top links">
    {#each menuItems as item (item.link)}
      <a class="menu-item {item.link}" href='/{item.link}'><i class="fa {item.icon}"></i> {item.text}</a>
    {/each}
  </div>
  <div class="bottom links">
    <a class="menu-item support" href='/support'><i class="fa fa-question-circle"></i> Support</a>
    <a class="menu-item settings" href='/settings'><i class="fa fa-cog"></i> Settings</a>
    <a class="menu-item profile" href='/profile'><i class="fa fa-user"></i> Profile Name</a>
  </div>
</div>

<style>
  /* Add your CSS styling for the side menu here */
  .side-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
    padding: 30px;
  }

  .top > :nth-child(1), .top > :nth-child(1):hover  {
    font-size: 24px;
    font-weight: 700;
    color: black;
    background-color: white;
  }

  

  .links {
    display:flex ;
    flex-direction: column;

    gap: 10px;

  }

  .fa {
    text-align: center;
    width: 30px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.345);
  margin: 0 5px;
}

  a {
    color: black;
    text-decoration: none;
    font-size: 16px;
    padding: 10px;
  }

  a:hover {
    background-color: black;
    color: white;
    border-radius: 5px;
  }

  a:hover .fa {
    color: white;
    border-radius: 5px;
  }
</style>