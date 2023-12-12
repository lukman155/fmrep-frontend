<script>
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { getDocs, query, where, collection, deleteDoc, doc, setDoc, Timestamp, addDoc } from 'firebase/firestore';

  import { db, auth } from '../../../lib/firebase/firebase';
  
  import { onMount } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast';
  import InputField from '../../../lib/components/InputField.svelte';

  export let propertyId;
  export let propertyName;

  let tenants = [];

  let fullName = '';
  let email = '';
  let defaultPassword = 'temp123';
  let isLoading = false;
  let error = null;

  const loadTenants = async () => {
    try {
      const q = query(collection(db, 'users'), where('propertyId', '==', propertyId));
    
      const querySnapshot = await getDocs(q);

      tenants = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()  
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const createTenant = async () => {
    try {
      isLoading = true;
      error = null;

      // Create user with email and password
      let adminUser = auth.currentUser;
      let adminId = auth.currentUser.uid
      toast.push(`${fullName} created successfully, Refresh page`, { classes: ['toast-success'] });
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);

      // Get the user's UID
      const { uid } = userCredential.user;

      // Save user data to Firestore
      const userDocRef = doc(db, 'users', uid); // Adjust 'users' collection as needed
      await setDoc(userDocRef, {
        fullName,
        email,
        propertyId,
        propertyName,
        adminId,
        createdAt: Timestamp.now(),
        uid,
      });

      auth.updateCurrentUser(adminUser);
      const mailCollection = collection(db, 'mail');
      await addDoc(mailCollection, {
        to: email,
        message: {
          subject: 'FMRepEx - Login Details',
          html: `Hello ${fullName}, this  is to inform you that your account has been successfully created,
                  your login details are as follows:
                  Email - ${email}
                  Password - ${defaultPassword}
                  Do not share this details with anyone.
                  Have a great day.`,
        },
      });
      loadTenants();
    } catch (error) {
      console.error('Error creating user:', error.message);
      error = error.message;
    } finally {
      isLoading = false;
    }
  };

  const deleteTenant = async (id) => {

    try {
      await deleteDoc(doc(db, 'users', id));
      toast.push('Tenant deleted');

      await loadTenants();
    } catch (err) {
      console.log(err);
    }

  };

  onMount(async () => {
    await loadTenants();
  });

</script>

<div>

  <div>
    <div>
      <InputField label={'Name'} bind:value={fullName}/>
      <InputField label={'Email'} bind:value={email}/>
      <InputField label={'Password'} bind:value={defaultPassword}/>
    </div>
    <button on:click={createTenant}>
      Add Tenant 
    </button>
  </div>

  {#await loadTenants()}
    <p>Loading...</p>
  {:then}
  
    {#if tenants.length === 0}
      <p>No tenants found</p>
    {:else}
      {#each tenants as tenant}
        <div>
          {tenant.fullName} - {tenant.email}
          
          <button on:click={() => deleteTenant(tenant.id)}>
            Delete
          </button>
        </div>
      {/each}
    {/if}

  {/await}

</div>

<style>
  button {
	box-shadow:inset 0px 1px 3px 0px #91b8b3;
	background:linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
	background-color:#768d87;
	border-radius:5px;
	border:1px solid #566963;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:15px;
	font-weight:bold;
	padding:4px 8px;
	text-decoration:none;
	text-shadow:0px -1px 0px #2b665e;
}
button:hover {
	background:linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
	background-color:#6c7c7c;
}
button:active {
	position:relative;
	top:1px;
}
</style>