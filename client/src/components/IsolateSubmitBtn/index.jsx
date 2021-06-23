
import {ThumbUp,Send} from '@material-ui/icons';
import { useWatch } from 'react-hook-form';
const IsolateSubmitBtn = ({control}) => {
    const [message,media] = useWatch({
        control,
        name : ['message','media'],
    })
    return (
        message || media?.length ? <Send/> : <ThumbUp/>
    )
}

export default IsolateSubmitBtn
