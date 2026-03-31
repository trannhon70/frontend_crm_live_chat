import instance from "../helper/api.helper";

export const liveChatColorAPI = {

    create,
    getPaging,
    deletes,
    update
};

function create(data: any) {
    return instance.post("/live-chat-color/create", data);
}


async function getPaging(query: any) {
    const respone = await instance.get(`/live-chat-color/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function deletes(id: any) {
    const response = await instance.delete(`/live-chat-color/delete/${id}`);
    return response.data
}

async function update(body: any) {
    const response = await instance.post(`/live-chat-color/update`, body);
    return response.data
}
