import { useState, useEffect } from 'react'
import { HiMiniPaperAirplane } from 'react-icons/hi2'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'

const MessageInput = ({ socket, roomId, isUserNotFound }) => {
    const [message, SetMessage] = useState('')
    const [messageData, setMessageData] = useState({})
    const [isSubmited, setIsSubmited] = useState(false)

    const userId = useSelector((state) => state.user.userId)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!message) return

        const date = new Date()

        const time = date.toISOString()

        const data = {
            message,
            createdAt: time,
            senderId: userId
        }

        setMessageData(data)
        SetMessage('')
        setIsSubmited(true)
    }

    useEffect(() => {
        const func = async () => {
            if (roomId && isSubmited) {
                socket.emit('send_msg', { messageData, roomId })

                setIsSubmited(false)
            }
        }

        func()
    }, [roomId, isSubmited])

    return (
        <>
            <form
                className="w-full fixed bottom-0 flex items-center justify-between gap-3 py-3 px-5 bg-main-bg md:px-10 md:py-6"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    placeholder="Message..."
                    id="msgInp"
                    className="w-full px-4 py-2 rounded-3xl text-base outline-none md:py-4 md:text-lg"
                    value={message}
                    onChange={(e) => SetMessage(e.target.value)}
                    autoComplete="off"
                    disabled={isUserNotFound}
                />
                <button
                    className="rounded-full bg-header-bg p-3 active:scale-95 duration-300 transition-all"
                    disabled={isUserNotFound}
                >
                    <HiMiniPaperAirplane
                        className="text-[1.3em] md:text-[3em]"
                        color="white"
                    />
                </button>
            </form>
        </>
    )
}

export default MessageInput
