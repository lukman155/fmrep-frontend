<script>
  import { checkAdminStatus } from './../lib/helper.js';

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { signOut } from 'firebase/auth';
  import { auth } from '../lib/firebase/firebase';
  import { onMount, onDestroy } from 'svelte';

  $: currentRoute = $page.route.id;

  let email = 'loading';
  let isAdmin = false;

  const unsubscribeAuth = auth.onAuthStateChanged((user) => {
    if (user) {
      onAuthStateChanged(user);
    } else {
      onAuthStateChanged(null);
    }
  });

  onMount(() => {
    // Initial check when the component is mounted
    checkAdmin();
  });

  onDestroy(() => {
    // Unsubscribe from the auth state changes when the component is destroyed
    unsubscribeAuth();
  });

  const onAuthStateChanged = (user) => {
    if (user) {
      email = user.email;
      checkAdmin();
    } else {
      email = 'loading';
      isAdmin = false;
    }
  };

  const checkAdmin = async () => {
    isAdmin = await checkAdminStatus();
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('uid');
        document.cookie = `isLoggedIn=false; max-age=3600`;

        goto('/login');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let menuItems = [
    // { text: 'Dashboard', link: 'dashboard', icon: 'fa-dashboard' },
    { text: 'Properties', link: 'properties', icon: 'fa-house' },
    { text: 'Announcements', link: 'announcements', icon: 'fa-bell' },
    { text: 'Tickets', link: 'tickets', icon: 'fa-ticket' },
  ];
</script>

<nav class="side-menu">
  <div class="top links">
    
    <a class="menu-item logo" href='/'><img src="/favicon.png" alt=""></a>

    {#if !isAdmin}
    {#each menuItems as item (item.link)}
      {#if item.link !== 'properties'}
        <a class="menu-item {item.link} {currentRoute.includes(item.link) ? 'active': ''}" href='/{item.link}'>
          <i class="fa {item.icon}"></i> {item.text}
        </a>
      {/if}
    {/each}
  {:else}
    {#each menuItems as item (item.link)}
      <a class="menu-item {item.link} {currentRoute.includes(item.link) ? 'active': ''}" href='/{item.link}'>
        <i class="fa {item.icon}"></i> {item.text}
      </a>
    {/each}
  {/if}
  </div>
  <div class="bottom links">
    <a class="menu-item support {currentRoute == '/support'? 'active': ''}" href='/support'><i class="fa fa-question-circle"></i> Support</a>
    <a class="menu-item settings {currentRoute == '/settings'? 'active': ''}" href='/settings'><i class="fa fa-cog"></i> Settings</a>
    <button class="menu-item profile " on:click={handleLogOut}><i class="fa-solid fa-arrow-right-from-bracket"></i>{email}</button>
  </div>
</nav>

<style>

  .logo {
    align-self: center;
    width: 80px;
    
  }

  .logo > img {
    width: 100%;
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

  .fa, .fa-solid {
    text-align: center;
    width: 14px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.345);
    margin: 0 5px;
}

button {
    color: black;
    text-decoration: none;
    font-size: 14px;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.20);
    text-align: left;
    background-color: transparent;
    cursor: pointer;
  }

  button:hover {
    color: coral;
    
    border: 1px solid coral;
    text-align: left;
    background-color: transparent;
  }

  button:hover > .fa-solid {
    color: rgb(255, 0, 0);
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