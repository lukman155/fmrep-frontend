// toastStore.js
import { writable } from 'svelte/store';

// Initial state
const initialState = {
  messages: [],
};

// Create a writable store
const toastStore = writable(initialState);

// Export the store
export default toastStore;
