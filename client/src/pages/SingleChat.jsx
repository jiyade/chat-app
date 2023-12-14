import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { HiChevronLeft } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import Message from '../components/Message'
import MessageInput from '../components/MessageInput'
import Loader from '../components/Loader'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`
const URL = import.meta.env.VITE_SERVER_BASE_URL

const SingleChat = ({ roomId, setRoomId }) => {
    const [user, setUser] = useState({})
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [isUserNotFound, setIsUserNotFound] = useState(false)

    const windowBottom = useRef(null)

    const { receiverId } = useParams()
    const userId = useSelector((state) => state.user.userId)

    const token = localStorage.getItem('token')
    const totalMessages = messages?.length
    const socket = io(URL)

    const userId1 = userId
    const userId2 = receiverId

    const getUser = async () => {
        try {
            const { data } = await axios.get(
                `${BASE_URL}/users/${receiverId}`,
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )

            setUser(data.user)
        } catch (err) {
            if (err?.response?.data?.msg) {
                if (err.response.status === 404) {
                    const user = {
                        name: 'User not found',
                        profile:
                            'https://thumbs2.imgbox.com/8f/05/DgatVnJe_t.jpg'
                    }
                    setIsUserNotFound(true)
                    setUser(user)
                }
                toast.error(err?.response?.data?.msg)
            } else {
                console.log(err)
            }
        }
    }

    const getRoom = async () => {
        if (userId1 && userId2) {
            try {
                const { data } = await axios.post(
                    `${BASE_URL}/rooms/getRoom`,
                    {
                        userId1,
                        userId2
                    },
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )

                setRoomId(data?.room?.roomId)
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }
    }

    const getMessages = async () => {
        if (!roomId) {
            return
        }

        try {
            setIsLoading(true)
            const { data } = await axios.get(`${BASE_URL}/messages/${roomId}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })

            setTimeout(() => {
                if (data?.messages?.messages) {
                    setTimeout(() => {
                        setMessages(data.messages.messages)
                        setIsLoading(false)
                    }, 300)
                } else {
                    setTimeout(() => {
                        setMessages([])
                        setIsLoading(false)
                    }, 500)
                }
                window.scrollTo(0, document.body.scrollHeight)
            }, 600)
        } catch (err) {
            if (err?.response?.data?.msg) {
                toast.error(err?.response?.data?.msg)
            } else {
                console.log(err)
            }
            setIsLoading(false)
        }
    }

    const deleteRoom = async () => {
        if (totalMessages === 0) {
            try {
                const { data } = await axios.delete(
                    `${BASE_URL}/rooms/${roomId}`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }

        socket.emit('leave_room', roomId)
    }

    const addMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/messages/${roomId}`,
                { messageData, roomId },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )
        } catch (err) {
            if (err?.response?.data?.msg) {
                toast.error(err?.response?.data?.msg)
            } else {
                console.log(err)
            }
        }
    }

    const addChat = async () => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/chats`,
                { roomId, receiverId },
                {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                }
            )
        } catch (err) {
            if (err?.response?.data?.msg) {
                toast.error(err?.response?.data?.msg)
            } else {
                console.log(err)
            }
        }
    }

    useEffect(() => {
        const funcs = async () => {
            try {
                setIsLoading(true)
                await getUser()
                await getRoom()
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }

        funcs()
    }, [userId1, userId2])

    useEffect(() => {
        const func = async () => {
            try {
                await getMessages()
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }

        if (roomId) {
            socket.emit('join_room', roomId)
            func()
        }
        return () => {
            socket.emit('leave_room', roomId)
        }
    }, [roomId])

    useEffect(() => {
        socket.on('receive_msg', (data) => {
            setMessages((messages) => {
                let objContains = false
                for (let i = 0; i < messages?.length; i++) {
                    if (messages[i]._id === data._id) {
                        objContains = true
                    } else {
                        objContains = false
                    }
                }

                if (!objContains) {
                    if (data.senderId === userId) {
                        addMessage(data)

                        if (messages?.length === 0) {
                            addChat()
                        }
                    }

                    return [...messages, data]
                } else {
                    return messages
                }
            })
        })

        socket.on('msg_deleted', (data) => {
            setMessages((messages) =>
                messages.filter((message) => message._id !== data)
            )
        })
    }, [socket])

    useEffect(() => {
        windowBottom.current?.scrollIntoView()
    }, [messages])

    return (
        <>
            <div className="flex flex-col w-full h-full">
                <header className="flex gap-2 items-center py-3 px-2 bg-header-bg sticky top-0 z-10">
                    <Link to={-1} onClick={deleteRoom}>
                        <HiChevronLeft
                            color="white"
                            className="text-[1.5em] md:text-[2em]"
                        />
                    </Link>
                    <img
                        src={user.profile}
                        className="rounded-full border w-[40px] h-[40px] md:w-[60px] md:h-[60px]"
                        alt="profile"
                    />
                    <div className="flex flex-col px-2 md:px-4">
                        <h2 className="text-white text-lg font-medium md:text-2xl">
                            {user.name}
                        </h2>
                        <h3 className="text-gray-300 text-xs md:text-base">
                            @{user.username}
                        </h3>
                    </div>
                </header>

                <div className="pt-6 pb-20 px-2 overflow-y-scroll">
                    <ul className="flex flex-col gap-4 w-full justify-center">
                        {messages?.map((message) => (
                            <Message
                                message={message}
                                userId={userId}
                                key={message._id}
                                setSelectedMessage={setSelectedMessage}
                                selectedMessage={selectedMessage}
                                roomId={roomId}
                                token={token}
                                socket={socket}
                                setIsLoading={setIsLoading}
                            />
                        ))}
                    </ul>
                    <div ref={windowBottom}></div>
                </div>

                <div>
                    <MessageInput
                        socket={socket}
                        roomId={roomId}
                        isUserNotFound={isUserNotFound}
                    />
                </div>
            </div>

            {isLoading && <Loader />}
        </>
    )
}

export default SingleChat
