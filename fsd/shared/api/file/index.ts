import {$api} from "@/fsd/shared/api/axios";

export const UploadFileFetcher = async (request: FormData): Promise<{id: string}> => {
    const {data} = await $api.post('/files', request, {
        headers: {
            "Content-type": "multipart/form-data",
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
export const DeleteFileFetcher = async (request: string) => {
    const {data} = await $api.delete(`/files/${request}`, {
        headers: {
            "Content-type": "multipart/form-data",
            "authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    return data;
}
