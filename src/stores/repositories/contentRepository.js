/** @format */

import axios from 'axios';
import API from '../../lib/API'
const contentRepository = {
    boardsGet: async (topicId) => {
        let path = `/boards`
        if (topicId) {
            path += `?topicId=${topicId}`
        }
        try {
            const response = await API.get(path);
            return response;
        } catch (error) {
            // throw Error(error);
            return false;
        }
    },
    boardGet: async (boarderId) => {
        try {
            const response = await API.get(`/board/${boarderId}`);
            return response;
        } catch (error) {
            //  throw Error(error);
            return false;
        }
    },
    boardDelete: async (boarderId) => {
        try {
            const response = await API.delete(`/board/${boarderId}`);
            return response;
        } catch (error) {
            throw Error(error);
            return false;
        }
    },
    boardsUpdate: async (boarderId, queryObj) => {
        try {
            const response = await API.put(`/board/${boarderId}`, queryObj);
            return response;
        } catch (error) {
            throw Error(error);
            return false;
        }
    },
    topicListGet: async () => {
        try {
            const response = await API.get('/topics');
            return response;
        } catch (error) {
            // throw Error(error);
            return false;
        }
    },
    signInCreate: async (queryObj) => {
        try {
            const response = await API.post('/signin', queryObj);
            return response;
        } catch (error) {
            // throw Error(error);
            return false;
        }
    },
    signUpCreate: async (queryObj) => {
        try {
            const response = await API.post('/signup', queryObj);
            return response;
        } catch (error) {
            // throw Error(error);
            return false;
        }
    },
    createContent: async (form) => {
        try {
            const response = await API.post('/boards', form, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": 'multipart/form-data'
                    // 'Accept': 'application/json; charset=utf-8'
                },
                withCredentials: true

            });
            return response;
        } catch (error) {
            // throw Error(error);
            return false;
        }
    },
};
export default contentRepository;
