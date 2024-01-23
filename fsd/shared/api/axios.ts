import axios from "axios";
export const $api = axios.create({
    baseURL: `${process.env.APP_BASE_URL}`,
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
    withCredentials: true
});
export const refreshAccessTokenFn = async () => {
    const response = await $api.get('/refresh');
    return response.data.accessToken;
};
$api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response.status === 403) {
            const { config } = error;
            const newToken = await refreshAccessTokenFn();
            localStorage.setItem('accessToken', newToken)
            config.headers.Authorization = `Bearer ${newToken}`
            return $api(config);
        }
        if (error.response.status === 401) {
            window.location.href = '/login';
            return;
        }
        return Promise.reject(error);
    },
);

