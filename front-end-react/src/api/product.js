import { send, reqType, endPoints } from './index';

const END_POINT = endPoints.product;

const methods = Object.freeze({
    base: '',
    rating: 'rating',
    all: 'all',
    stockControl: 'stock-control',
    getByCategory: 'get-by-category',
    remove: 'remove',
    update: 'update',
    getById: 'get-by-id',
    insert: 'insert'
})

export const getProducts = () => {
    return send(reqType.get, END_POINT + methods.base, null, null)
}