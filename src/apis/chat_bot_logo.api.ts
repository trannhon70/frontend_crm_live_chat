import instance from "../helper/api.helper";

export const chatBoxLogoAPI = {
    create,
   getOne
};

async function create(body:any) {
    const respone = await instance.post("/chat-box-logo/create",body,
        {
            headers:{
            'Content-Type': 'multipart/form-data',
        }
        }
     );
    return respone.data
}

async function getOne() {
    const respone = await instance.get("/chat-box-logo/get-one" );
    return respone.data
}