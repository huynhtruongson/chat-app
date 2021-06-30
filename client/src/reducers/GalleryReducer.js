import { GET_FILE_GALLERY, GET_IMAGE_GALLERY, GET_VIDEO_GALLERY } from "../actions/type"

const initialState = {
    imageGallery : [],
    videoGallery : [],
    fileGallery : []
}
const GalleryReducer = (state = initialState,action) => {
    switch (action.type) {
        case GET_IMAGE_GALLERY : 
            return {...state,imageGallery : action.payload}
        case GET_VIDEO_GALLERY : 
            return {...state,videoGallery : action.payload} 
        case GET_FILE_GALLERY : 
            return {...state,fileGallery : action.payload}
        default:
            return state;
    }
}
export default GalleryReducer