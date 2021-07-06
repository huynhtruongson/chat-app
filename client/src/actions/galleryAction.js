import MessageApi from "../api/messageApi";
import { GET_ACTIVE_IMAGE, GET_FILE_GALLERY, GET_IMAGE_GALLERY, GET_VIDEO_GALLERY, REMOVE_ACTIVE_IMAGE } from "./type";

export const getImageGallery = (id) => async (dispatch) => {
    try {
        const res = await MessageApi.getImageGalerry(id)
        if(res.status === 200) {
            const imageList = res.data.map(img => img.url_cloud) 
            dispatch({type : GET_IMAGE_GALLERY,payload : imageList})
        }
    } catch (error) {
        console.log(error);
    }
}
export const getVideoGallery = (id) => async (dispatch) => {
    try {
        const res = await MessageApi.getVideoGalerry(id)
        if(res.status === 200) {
            const videoList = res.data.map(vd => vd.url_cloud) 
            dispatch({type : GET_VIDEO_GALLERY,payload : videoList})
        }
    } catch (error) {
        console.log(error);
    }
}
export const getFileGallery = (id) => async (dispatch) => {
    try {
        const res = await MessageApi.getFileGalerry(id)
        if(res.status === 200) {
            const fileList = res.data.map(file => ({url_cloud: file.url_cloud,name : file.name})) 
            dispatch({type : GET_FILE_GALLERY,payload : fileList})
        }
    } catch (error) {
        console.log(error);
    }
}
export const getActiveImage = (url) => ({
    type : GET_ACTIVE_IMAGE,
    payload : url
})
export const removeActiveImage = () => ({
    type : REMOVE_ACTIVE_IMAGE,
})