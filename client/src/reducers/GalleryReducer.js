import { DELETE_CONVERSATION, DELETE_CONVERSATION_GALLERY, DELETE_GALLERY, GET_ACTIVE_IMAGE, GET_FILE_GALLERY, GET_IMAGE_GALLERY, GET_VIDEO_GALLERY, REMOVE_ACTIVE_IMAGE, UPDATE_GALLERY } from "../actions/type"

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
        case UPDATE_GALLERY :
            const imgArr = [...state.imageGallery]
            const videoArr = [...state.videoGallery]
            const fileArr = [...state.fileGallery]
            action.payload.forEach(md => {
                if(md.resource_type === 'image')
                    imgArr.unshift(md.url_cloud)
                else if(md.resource_type === 'video')
                    videoArr.unshift(md.url_cloud)
                else if(md.resource_type === 'raw')
                    fileArr.unshift({url_cloud : md.url_cloud, name : md.name})
            })
            return {...state,imageGallery : imgArr,videoGallery : videoArr, fileGallery : fileArr}
        case DELETE_GALLERY:
            let imgList = [...state.imageGallery]
            let videoList = [...state.videoGallery]
            let fileList = [...state.fileGallery]
            const delList = action.payload.map(md => md.url_cloud)
            imgList = imgList.filter(i => !delList.includes(i))
            videoList = videoList.filter(v => !delList.includes(v))
            fileList = fileList.filter(f => !delList.includes(f.url_cloud))
            return {...state,imageGallery : imgList,videoGallery : videoList, fileGallery : fileList}
        case DELETE_CONVERSATION_GALLERY:
            return {...state,imageGallery : [],videoGallery : [],fileGallery : []}
        default:
            return state;
    }
}
export default GalleryReducer