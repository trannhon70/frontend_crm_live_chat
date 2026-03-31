import instance from "../helper/api.helper";

export const userAPI = {
    login,
    getByIdUser,
    create,
    getPagingAdmin,
    closeTheLock,
    updatePassword,
    getById,
    update,
    getPagingUserFriend,
    logout,
    updateProfile,
    getAllTuVan,
    updateOrder,
    updateOnline,
    getPagingNoDelete
};

function login(data: any) {
    return instance.post("/users/login", data);
}

function logout() {
    return instance.post("/users/logout");
}

function getByIdUser() {
    return instance.get("/users/get-by-id-user");
}

function create(data: any) {
    return instance.post("/users/create", data);
}


async function getPagingAdmin(query: any) {
    const response = await instance.get(`/users/get-paging-admin?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}`);
    return response.data.data
}

async function getPagingNoDelete(query: any) {
    const response = await instance.get(`/users/get-paging-no-delete?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}`);
    return response.data.data
}

async function getPagingUserFriend(query: any) {
    const response = await instance.get(`/users/get-paging-user-friend?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&userId=${query.userId}&search=${query.search}`);
    return response.data.data
}

async function closeTheLock(body: any) {
    const response = await instance.post("/users/close-the-lock", body);
    return response.data
}

async function updatePassword(id: number, body: any) {
    const response = await instance.put(`/users/update-password/${id}`, body);
    return response.data
}

async function getById(id: number) {
    const response = await instance.get(`/users/get-by-id/${id}`);
    return response.data.data
}

async function update(id: number, body: any) {
    const response = await instance.put(`/users/update/${id}`, body);
    return response.data
}

async function updateProfile(body: any) {
    const response = await instance.post(`/users/update-profile`, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return response.data
}

async function getAllTuVan() {
    const response = await instance.get(`/users/get-all-tu-van`);
    return response.data.data
}

async function updateOrder(body: any) {
    const response = await instance.post(`/users/update-order`, body);
    return response.data
}

async function updateOnline(body: any) {
    const response = await instance.post(`/users/update-online`, body);
    return response.data
}
