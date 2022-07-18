import axios from 'axios';

const BASE_URL = 'http://localhost:4205/api/';

export const send = (type, route, body, params) => {
    let url = prepareAddress({ route, params });
    if (type === reqType.get) {
        return axios.get(url)
    }
    return axios.post(url, body)
}

const prepareAddress = ({ route, params }) => {
    let address = BASE_URL + route;
    if (params) {
        address += '?' + setParams(params);
    }
    return address;
}

const setParams = (params) => {
    let res = '';
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            res += key + '=' + params[key] + '&';
        }
    }
    return res.slice(0, -1);
}

export const reqType = {
    get: 'get',
    post: 'post'
}


export const endPoints = Object.freeze({
    category: 'category',
    product: 'product',
    user: 'user',
    order: 'order',
    contact: 'contact',
    auth: 'auth',
    photo: 'photo',
    cart: 'cart',
    db: 'db',
    log: 'log'
})
