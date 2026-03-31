import instance from "../helper/api.helper";

export const labelAPI = {
    getPaging,
    create,
    deletes,
    getById,
    update,
    getAll,
    
};


async function create(body: any) {
    const response = await instance.post(`/label/create`,body);
    return response.data
}

async function getPaging(query: any) {
    const response = await instance.get(`/label/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}`);
    return response.data.data
}

async function deletes(id: any) {
    const response = await instance.delete(`/label/delete/${id}`);
    return response.data
}

async function getById(id: any) {
    const response = await instance.get(`/label/get-by-id/${id}`);
    return response.data
}

async function update(id:number, body: any) {
    const response = await instance.put(`/label/update/${id}`,body);
    return response.data
}



async function getAll() {
    const response = await instance.get(`/label/get-all`);
    return response.data
}