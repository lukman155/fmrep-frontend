import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').PageServerLoad} */
export const load = ({ cookies }) => {
	
	const isLoggedIn = cookies.get('isLoggedIn') === 'true';
	console.log(isLoggedIn)
	
	if(!isLoggedIn) {
    throw redirect(302, '/login')
  }
};