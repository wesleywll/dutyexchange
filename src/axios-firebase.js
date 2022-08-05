import axios from 'axios';
import inDevMode from './utility/dev';

// switch between test or public server
const BASE_URL= (inDevMode? 'https://dswap-aa4eb.firebaseio.com/' : 'https://duty-exchange.firebaseio.com/');

const instance = axios.create({
    baseURL: BASE_URL,
});

export default instance;