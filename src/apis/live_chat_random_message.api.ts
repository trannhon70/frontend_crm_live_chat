import instance from "../helper/api.helper";

export const liveChatRandomMessage = {
    create,
    getPaging,
    deletes,
    update
};

async function create(body:any) {
    const respone = await instance.post("/live-chat-random-message/create",body);
    return respone.data
}

async function getPaging(query:any) {
    const respone = await instance.get(`/live-chat-random-message/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function deletes(id:number) {
    const respone = await instance.get(`/live-chat-random-message/delete/${id}`);
    return respone.data.data
}

async function update(id:number, body:any) {
    const respone = await instance.put(`/live-chat-random-message/update/${id}`,body);
    return respone.data.data
}