import instance from "../helper/api.helper";

export const LiveChatTimeAPI = {
    create,
    getAll,
    
};


async function create(body: any) {
    const response = await instance.post(`/live-chat-time/create`,body);
    return response.data
}



async function getAll() {
    const response = await instance.get(`/live-chat-time/get-all`);
    return response.data
}