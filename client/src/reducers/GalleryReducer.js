import { GET_ACTIVE_IMAGE, GET_FILE_GALLERY, GET_IMAGE_GALLERY, GET_VIDEO_GALLERY, REMOVE_ACTIVE_IMAGE } from "../actions/type"

const initialState = {
    imageGallery : [],
    videoGallery : [],
    fileGallery : [],
    activeImage : null
}
const GalleryReducer = (state = initialState,action) => {
    switch (action.type) {
        case GET_IMAGE_GALLERY : 
            return {...state,imageGallery : action.payload}
        case GET_VIDEO_GALLERY : 
            return {...state,videoGallery : action.payload} 
        case GET_FILE_GALLERY : 
            return {...state,fileGallery : action.payload}
        case GET_ACTIVE_IMAGE : 
            return {...state,activeImage : action.payload}
        case REMOVE_ACTIVE_IMAGE : 
            return {...state,activeImage : null}
        default:
            return state;
    }
}
export default GalleryReducer