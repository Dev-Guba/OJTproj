import Http from './Http.js';

const Api = {
    AdminLoginAPI: (data) => {
        return Http.post('/auth/login');
    }
}

export default Api;