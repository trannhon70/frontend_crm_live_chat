import instance from "../helper/api.helper";

export const replyListAPI = {
    create,
    getPaging,
    update,
    deleteReply
};


async function create(body: any) {
    const response = await instance.post(`/reply-list/create`, body);
    return response.data
}

async function getPaging(query: any) {
    const respone = await instance.get(`/reply-list/get-paging?pageSize=${query.pageSize}&pageIndex=${query.pageIndex}`);
    return respone.data
}

async function update(body: any) {
    const response = await instance.post(`/reply-list/update`, body);
    return response.data
}

async function deleteReply(id: number) {
    const response = await instance.delete(`/reply-list/delete/${id}`);
    return response.data
}