import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { HiChevronLeft, HiMagnifyingGlassCircle } from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import Chat from '../components/Chat'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const Search = ({ setRoomId }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const searchInp = useRef()

    const token = localStorage.getItem('token')

    useEffect(() => {
        searchInp.current.focus()

        const controller = new AbortController()
        const signal = controller.signal

        const getUsers = async () => {
            try {
                setIsLoading(true)
                setUsers([])
                const { data } = await axios.get(
                    `${BASE_URL}/users?query=${searchQuery}`,
                    {
                        signal,
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )
                setTimeout(() => {
                    setUsers([...data.users])
                    setIsLoading(false)
                }, 300)
            } catch (err) {
                setIsLoading(false)
                if (!axios.isCancel(err)) {
                    if (err?.response?.status === 400) {
                        setUsers([])
                    } else {
                        if (err?.response?.data?.msg) {
                            toast.error(err?.response?.data?.msg)
                        } else {
                            console.log(err)
                        }
                    }
                }
            }
        }

        getUsers()

        return () => {
            controller.abort()
        }
    }, [searchQuery, BASE_URL, setUsers, setIsLoading, token])

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <>
            <div>
                <header className="flex gap-3 items-center py-3 px-4 bg-header-bg md:py-5 md:px-6">
                    <Link to="/app/chats">
                        <HiChevronLeft
                            color="white"
                            className="text-[1.5em] md:text-[2em]"
                        />
                    </Link>
                    <h1 className="text-2xl text-white font-medium md:text-3xl">
                        Search
                    </h1>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="flex items-center justify-between gap-2 py-3 px-6 border-b-2 md:px-8 md:py-6 w-full"
                >
                    <input
                        type="text"
                        placeholder="Enter the username or name..."
                        id="searchInp"
                        className="w-72 px-4 py-2 rounded-3xl outline-none w-full md:py-4 md:text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        ref={searchInp}
                        autoComplete="off"
                    />
                    <button>
                        <HiMagnifyingGlassCircle
                            color="white"
                            className="text-[3em] md:text-[4.3em]"
                        />
                    </button>
                </form>

                {searchQuery.length > 0 && (
                    <div className="py-6 px-4">
                        {users.length > 0 && (
                            <ul className="flex flex-col gap-6">
                                {users.map((user) => (
                                    <Chat
                                        user={user}
                                        setRoomId={setRoomId}
                                        token={token}
                                        callOnClick={true}
                                        to="/app/chats"
                                        key={user._id}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {searchQuery && isLoading && (
                <div className="absolute w-full py-6 flex justify-center items-center">
                    <span className="loader"></span>
                </div>
            )}

            {searchQuery && !users.length && !isLoading && (
                <div className="flex justify-center items-center text-white text-xl font-medium -mt-4 md:text-4xl">
                    <h1>No user found!</h1>
                </div>
            )}
        </>
    )
}

export default Search
