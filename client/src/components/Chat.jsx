import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const Chat = ({ user, to, setRoomId, token, callOnClick = false }) => {
    const { _id: userId, name, username, profile, receiverId } = user

    const userId1 = useSelector((state) => state.user.userId)
    const userId2 = userId

    const createRoom = async () => {
        try {
            const { data } = await axios.post(
                `${BASE_URL}/rooms`,
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

            setRoomId(data.room.roomId)
        } catch (err) {
            if (err?.response?.data?.msg) {
                toast.error(err?.response?.data?.msg)
            } else {
                console.log(err)
            }
        }
    }

    return (
        <li onClick={callOnClick ? createRoom : undefined}>
            <Link
                to={to ? `${to}/${userId}` : receiverId}
                className="flex gap-3 items-center w-full"
            >
                <img
                    src={profile}
                    className="rounded-full border w-[50px] h-[50px] md:w-[70px] md:h-[70px]"
                    alt="profile"
                />
                <div className="flex flex-col px-2 md:px-4">
                    <h3 className="text-white text-base md:text-2xl">{name}</h3>
                    <h3 className="text-gray-300 text-xs md:text-lg">
                        @{username}
                    </h3>
                </div>
            </Link>
        </li>
    )
}

export default Chat
