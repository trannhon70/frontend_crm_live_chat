import instance from "../helper/api.helper";

export const timeDisplayChatlAPI = {
    create,
    getAll,
    
};


async function create(body: any) {
    const response = await instance.post(`/time-display-chat/create`,body);
    return response.data
}



async function getAll() {
    const response = await instance.get(`/time-display-chat/get-all`);
    return response.data
}