import instance from "../helper/api.helper";

export const rolesAPI = {
    getAll,

};

async function getAll() {
    const respone = await instance.get("/roles/get-all");
    return respone.data
}