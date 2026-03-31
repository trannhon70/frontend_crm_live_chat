import instance from "../helper/api.helper";

export const messageAPI = {
    uploadFile,
    updateStatus,
    getPaging,
    getByIdConversation
};

async function uploadFile(body: any) {
    const respone = await instance.post(`/message/upload`, body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return respone.data
}

async function updateStatus(body: any) {
    const respone = await instance.post(`/message/update-status`, body);
    return respone.data
}

async function getPaging(query: any) {
    const respone = await instance.get(`/message/get-paging?pageSize=${query.pageSize}&pageIndex=${query.pageIndex}&conversationId=${query.conversationId}`);
    return respone.data
}

async function getByIdConversation(query: any) {
    const respone = await instance.get(`/message/get-by-id-conversation?pageSize=${query.pageSize}&pageIndex=${query.pageIndex}&conversationId=${query.conversationId}&userId=${query.userId}`);
    return respone.data
}