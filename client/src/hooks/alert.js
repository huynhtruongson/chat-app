import { makeStyles} from '@material-ui/core'
import React from 'react'
import Swal  from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const useAlert = () => {
    const style =  useStyle()
    const mySwal = withReactContent(Swal)
    const _alert = ({title,msg,callback,...props}) => {
        mySwal.fire({
            allowOutsideClick : false,
            title : title && <p>{title}</p>,
            html : msg && <p>{msg}</p>,
            customClass : {
                title : style.title,
                htmlContainer : style.text,
                container : style.swalContainer
            },
            ...props
        }).then(callback)
    }
    return {_alert}
}
const useStyle = makeStyles(theme => ({
    title : {
        padding : '0 1rem',
        fontSize : '1.5rem',
        fontWeight : 500
    },
    text : {
        padding : '0 1rem',
    },
    swalContainer : {
        zIndex : theme.zIndex.modal + 1
    }
}))
export default useAlert
