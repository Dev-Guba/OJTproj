import Http from './Http.js';

const Api = {
    AdminLoginAPI: (data) => {
        return Http.post('/admin/auth/login', data);
    }
}

export default Api;