import instance from "../helper/api.helper";

export const chatBoxMessageRandomAPI = {
    create,
    getPaging,
    deletes,
    update
};

async function create(body:any) {
    const respone = await instance.post("/chat-box-message-random/create",body);
    return respone.data
}

async function getPaging(query:any) {
    const respone = await instance.get(`/chat-box-message-random/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function deletes(id:number) {
    const respone = await instance.get(`/chat-box-message-random/delete/${id}`);
    return respone.data.data
}

async function update(id:number, body:any) {
    const respone = await instance.put(`/chat-box-message-random/update/${id}`,body);
    return respone.data.data
}