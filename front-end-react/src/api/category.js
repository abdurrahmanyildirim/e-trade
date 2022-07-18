import { send, reqType, endPoints } from './index';

const END_POINT = endPoints.category;

const methods = Object.freeze({
    base: '',
    insert: 'insert',
    remove: 'remove'
})

export const getCategories = () => {
    return send(reqType.get, END_POINT + methods.base, null, null)
}