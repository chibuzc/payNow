import axios from 'axios'
export const isLoggedIn  = async () => {
   const isUser = await axios.get('/api/current_user');
   return isUser.data
}
