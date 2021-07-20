import Swal  from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// const useAlert = () => {
//     const style =  useStyle()
//     const mySwal = withReactContent(Swal)
    const _alert = ({title,msg,callback,...props}) => {
        // const style =  useStyle()
        const mySwal = withReactContent(Swal)
        mySwal.fire({
            allowOutsideClick : false,
            title : title && <p>{title}</p>,
            html : msg && <p>{msg}</p>,
            customClass : {
                title : 'sweet-alert-title',
                htmlContainer : 'sweet-alert-msg',
                container : 'sweet-alert-container'
            },
            ...props
        }).then(callback)
    }
    // return {_alert}
// }
export default _alert
