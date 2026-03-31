import instance from "../helper/api.helper";

export const friendAPI = {

    create,
    getAllById,
    getAllFriendUser
};

function create(data: any) {
    return instance.post("/friend/create", data);
}

async function getAllById(id: number) {
    const respone = await instance.get(`/friend/get-all-by-id/${id}`);
    return respone.data.data;
}

async function getAllFriendUser() {
    const respone = await instance.get(`/friend/get-all-friend-user`);
    return respone.data.data;
}

