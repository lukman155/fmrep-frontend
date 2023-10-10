<script>

  import { page } from '$app/stores'
  import { onMount } from 'svelte';

  $: currentRoute = $page.route.id;



  let menuItems = [
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

<nav class="side-menu">
  <div class="top links">
    
    <a class="menu-item logo" href='/'>FMRepEx</a>

    {#each menuItems as item (item.text)}
      <a class="menu-item {item.link} {currentRoute == '/'+item.link? 'active': ''}" href='/{item.link}'><i class="fa {item.icon}"></i> {item.text}</a>
    {/each}
  </div>
  <div class="bottom links">
    <a class="menu-item support {currentRoute == '/support'? 'active': ''}" href='/support'><i class="fa fa-question-circle"></i> Support</a>
    <a class="menu-item settings {currentRoute == '/settings'? 'active': ''}" href='/settings'><i class="fa fa-cog"></i> Settings</a>
    <a class="menu-item profile {currentRoute == '/profile'? 'active': ''}" href='/profile'><i class="fa fa-user"></i> Profile Name</a>
  </div>
</nav>

<style>

  .active, .active > .fa {
    background-color: black;
    color: white;
    border-radius: 10px;
  }


  .active.support, .active.support > .fa {
    background-color: rgba(0, 80, 36, 0.788);
  }

  a.support:hover {
    background-color: rgba(0, 80, 36, 0.788);
  }
  

  .active.settings {
    background-color: rgba(0, 21, 80, 0.788);
  }

  a.settings:hover {
    background-color: rgba(0, 21, 80, 0.788);
  }
  

  .active.profile, .active.profile > .fa {
    background-color: rgb(255, 0, 0);
  }

  a.profile:hover {
    background-color: rgb(255, 0, 0);
  }
  

  .active, .active > .fa {
    background-color: black;
    color: white;
    border-radius: 10px;
  }
  .active:hover {
    background-color: black;
  }
  /* Add your CSS styling for the side menu here */
  .side-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    height: 100%;
    width: max-content;
  }

  .top > :nth-child(1), .top > :nth-child(1):hover  {
    text-align: left;
    font-size: 24px;
    font-weight: 700;
    color: black;
    background-color: white;
  }

  .links {
    display:flex ;
    flex-direction: column;
    gap: 10px;
    margin: 2em 1em;
  }

  .fa {
    text-align: center;
    width: 14px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.345);
    margin: 0 5px;
}

  a {
    color: black;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;

  }

  a:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;

  }

  a:hover .fa  {
    background-color: transparent;
    color: white;
  }
</style>