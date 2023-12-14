import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import Chat from '../components/Chat'
import { HiMiniChatBubbleOvalLeftEllipsis } from 'react-icons/hi2'
import { toast } from 'react-hot-toast'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const Chats = () => {
    const [chats, setChats] = useState([])

    const token = localStorage.getItem('token')

    useEffect(() => {
        async function getChats() {
            try {
                const { data } = await axios.get(`${BASE_URL}/chats`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })

                if (data?.chats?.chats) {
                    setChats((chats) => {
                        let chatContains = false
                        for (let i = 0; i < chats.length; i++) {
                            for (let j = 0; j < data.chats.chats.length; j++) {
                                if (chats[i]._id === data.chats.chats[j]._id) {
                                    chatContains = true
                                }
                            }
                        }

                        if (!chatContains) {
                            return [...chats, ...data.chats.chats.reverse()]
                        } else {
                            return chats
                        }
                    })
                }
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }

        getChats()
    }, [])

    return (
        <div>
            <Header />

            <div className="py-6 px-4 md:py-7 md:px-6">
                <ul className="flex flex-col gap-6">
                    {chats.map((chat) => (
                        <Chat user={chat} key={chat._id} />
                    ))}
                </ul>
            </div>

            <div className="fixed bottom-6 right-6 bg-[#9ab0b3] rounded-xl p-1/2 md:p-2 md:bottom-8 md:right-8">
                <Link to="/app/search">
                    <HiMiniChatBubbleOvalLeftEllipsis
                        className="text-[3em] md:text-[4em]"
                        color="#04081a"
                    />
                </Link>
            </div>
        </div>
    )
}

export default Chats
