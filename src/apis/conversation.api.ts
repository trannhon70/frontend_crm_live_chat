import instance from "../helper/api.helper";

export const conversationAPI = {
    getAll,
    getById,
    updateName,
    getPaging,
    updateLabel
};

async function getAll(query: any) {
    const respone = await instance.get(`/conversation/get-all?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function getById(id: number) {
    const respone = await instance.get(`/conversation/get-by-id/${id}`);
    return respone.data
}

async function updateName(id: number, body: any) {
    const respone = await instance.put(`/conversation/update-name/${id}`, body);
    return respone.data
}

async function getPaging(query: any) {
    const respone = await instance.get(`/conversation/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&startTime=${query.date[0]}&endTime=${query.date[1]}&quatity=${query.quatity}&search=${query.search}`);
    return respone.data.data
}

async function updateLabel(body: any) {
    const response = await instance.post(`/conversation/update-label`, body);
    return response.data
}