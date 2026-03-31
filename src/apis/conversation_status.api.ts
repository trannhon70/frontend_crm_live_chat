import instance from "../helper/api.helper";

export const conversationStatusAPI = {
    getByIdComputer,
    create
};



async function getByIdComputer(query: any) {
    const respone = await instance.get(`/conversation-status/get-by-id-computer?conversationId=${query.conversationId}&idComputer=${query.idComputer}&senderType=${query.senderType}`);
    return respone.data
}

async function create(body: any) {
    const respone = await instance.post(`/conversation-status/create`, body);
    return respone.data
}