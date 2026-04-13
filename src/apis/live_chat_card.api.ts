import instance from "../helper/api.helper";

export const liveChatCardAPI = {
    create,
    getByIdUser
};

async function create(body:any) {
    const respone = await instance.post("/live-chat-card/create",body );
    return respone.data
}

async function getByIdUser() {
    const respone = await instance.get("/live-chat-card/get-by-id-user" );
    return respone.data
}
