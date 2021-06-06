import { makeStyles} from '@material-ui/core'
import React from 'react'
import Swal  from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const useAlert = () => {
    const style =  useStyle()
    const mySwal = withReactContent(Swal)
    const _alert = ({icon,title,msg,callback}) => {
        mySwal.fire({
            allowOutsideClick : false,
            icon,
            title : title && <p>{title}</p>,
            html : msg && <p>{msg}</p>,
            customClass : {
                title : style.title,
                htmlContainer : style.text
            }
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
    }
}))
export default useAlert
