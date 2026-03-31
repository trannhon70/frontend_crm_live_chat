import instance from "../helper/api.helper";

export const blockIplAPI = {
    getPaging,
    create,
    deletes,
    getById,
    update,
    getAll,
    
};


async function create(body: any) {
    const response = await instance.post(`/block-ip/create`,body);
    return response.data
}

async function getPaging(query: any) {
    const response = await instance.get(`/block-ip/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}&status=${query.status}`);
    return response.data.data
}

async function deletes(id: any) {
    const response = await instance.delete(`/block-ip/delete/${id}`);
    return response.data
}

async function getById(id: any) {
    const response = await instance.get(`/block-ip/get-by-id/${id}`);
    return response.data
}

async function update(id:number, body: any) {
    const response = await instance.put(`/block-ip/update/${id}`,body);
    return response.data
}



async function getAll() {
    const response = await instance.get(`/block-ip/get-all`);
    return response.data
}