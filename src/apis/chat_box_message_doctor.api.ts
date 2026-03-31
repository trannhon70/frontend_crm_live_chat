import instance from "../helper/api.helper";

export const chatBoxMessageDoctorAPI = {
    create,
    getByIdUser
};

async function create(body:any) {
    const respone = await instance.post("/chat-box-massage-doctor/create",body );
    return respone.data
}

async function getByIdUser() {
    const respone = await instance.get("/chat-box-massage-doctor/get-by-id-user" );
    return respone.data
}
