import { FaTrash } from 'react-icons/fa'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const MessageOptions = ({
    roomId,
    msgId,
    token,
    socket,
    setIsLoading,
    setIsLongPress
}) => {
    const handleMessageDelete = async () => {
        try {
            setIsLoading(true)
            setIsLongPress(false)

            const { data } = await axios.delete(
                `${BASE_URL}/messages/${roomId}/${msgId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )

            if (data.status === 'success') {
                socket.emit('delete_msg', { roomId, msgId })
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex justify-center items-center w-full h-full">
            <span onClick={handleMessageDelete}>
                <FaTrash color="#000" className="text-[1em] md:text-[1.7em]" />
            </span>
        </div>
    )
}

export default MessageOptions
