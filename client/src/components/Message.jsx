import { useState, useEffect, useRef } from 'react'
import { formatTime } from '../utils/helpers'
import MessageOptions from './MessageOptions'

const Message = ({
    message,
    userId,
    selectedMessage,
    setSelectedMessage,
    roomId,
    token,
    socket,
    setIsLoading
}) => {
    const [pressTimer, setPressTimer] = useState(null)
    const [isLongPress, setIsLongPress] = useState(false)

    const { message: msg, senderId, createdAt } = message

    const formattedTime = formatTime(createdAt)

    const received = senderId !== userId

    const handleTouchStart = () => {
        document.body.classList.add('select-none')
        setPressTimer(setTimeout(handleLongPress, 500))
    }

    const handleTouchEnd = () => {
        document.body.classList.remove('select-none')
        clearTimeout(pressTimer)
    }

    const handleLongPress = () => {
        document.body.classList.remove('select-none')
        setIsLongPress(true)
        setSelectedMessage(message._id)
    }

    const optionsDiv = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                optionsDiv.current &&
                !optionsDiv.current.contains(e.target) &&
                !e.target.closest('.group') &&
                selectedMessage
            ) {
                setIsLongPress(false)
                setSelectedMessage(null)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [selectedMessage])

    return (
        <li
            className={`w-3/4 rounded-lg px-4 py-3 flex flex-col relative text-black overflow-hidden group md:px-6 md:py-5 md:w-4/6 ${
                received ? 'self-start bg-[#9ab0b3]' : 'self-end bg-[#76acb3]'
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="rounded-lg">
                <span className="py-1 text-base md:text-xl">{msg}</span>
                <span className="text-gray-500 text-[0.65rem] absolute right-3 bottom-1 md:text-base">
                    {formattedTime.time}
                </span>
            </div>

            {!received && (
                <div
                    className={`absolute top-0 right-0 w-full h-full transition-transform duration-300 ease-in-out transform translate-x-full bg-inherit md:group-hover:translate-x-0 ${
                        isLongPress && selectedMessage === message._id
                            ? 'max-md:translate-x-0'
                            : 'max-md:translate-x-full'
                    }`}
                    ref={optionsDiv}
                >
                    <MessageOptions
                        roomId={roomId}
                        msgId={message._id}
                        token={token}
                        socket={socket}
                        setIsLoading={setIsLoading}
                        setIsLongPress={setIsLongPress}
                    />
                </div>
            )}
        </li>
    )
}

export default Message
