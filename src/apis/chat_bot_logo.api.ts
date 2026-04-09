import instance from "../helper/api.helper";

export const chatBoxLogoAPI = {
    create,
    getOne
};

async function create(body: any) {
    const respone = await instance.post("/live-chat-logo/create", body,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
    );
    return respone.data
}

async function getOne() {
    const respone = await instance.get("/live-chat-logo/get-one");
    return respone.data
}