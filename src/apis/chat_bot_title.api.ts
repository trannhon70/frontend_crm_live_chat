import instance from "../helper/api.helper";

export const chatBotTitleAPI = {
    create,
   getOne
};

async function create(body:any) {
    const respone = await instance.post("/chat-bot-title/create",body );
    return respone.data
}

async function getOne() {
    const respone = await instance.get("/chat-bot-title/get-one" );
    return respone.data
}