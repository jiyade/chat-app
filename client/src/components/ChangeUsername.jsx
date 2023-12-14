import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateUsername } from '../slices/userSlice'
import { toast } from 'react-hot-toast'
import Button from './Button'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const ChangeUsername = ({
    setIsChangeUsername,
    userId,
    currentUsername,
    token,
    setIsLoading,
    isLoading
}) => {
    const [username, setUsername] = useState('')

    const inp = useRef(null)

    const dispatch = useDispatch()
    //insertCompositionText
    const handleUsernameInput = (e) => {
        setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))
        if (username.length > 10) {
            username.slice(-1, 1)
        }
        if (username.includes(' ')) {
            username.replace(/\s/g, '')
        }
    }

    const handleChangeUsername = async () => {
        if (username.length >= 3) {
            if (username !== currentUsername) {
                try {
                    setIsLoading(true)
                    const { data } = await axios.patch(
                        `${BASE_URL}/users/${userId}`,
                        {
                            updateValue: {
                                username: username
                                    .toLowerCase()
                                    .replace(/\s/g, '')
                            }
                        },
                        {
                            headers: {
                                authorization: `Bearer ${token}`
                            }
                        }
                    )

                    localStorage.setItem('token', data.token)
                    dispatch(updateUsername(data.user.username))
                    toast.success('Username changed!')
                } catch (err) {
                    if (err?.response?.data?.msg) {
                        toast.error(err?.response?.data?.msg)
                    } else {
                        console.log(err)
                    }
                } finally {
                    setIsChangeUsername(false)
                    setIsLoading(false)
                }
            } else {
                toast.error(
                    'New username cannot be the same as the old username'
                )
            }
        } else {
            toast.error('Username must contain atleast 3 letters')
        }
    }

    useEffect(() => {
        inp.current.focus()
    }, [])

    return (
        <div className="text-white w-full h-full absolute top-0 flex justify-center items-center z-20">
            <div className="bg-header-bg flex flex-col justify-center gap-1 px-4 py-6 rounded-xl w-[95%] md:py-10 md:w-4/6 md:gap-6 md:rounded-2xl">
                <div className="md:text-2xl">
                    <label htmlFor="username" className="capitalize text-white">
                        Username:
                    </label>
                    <input
                        type="text"
                        className="border-2 w-full p-2 mt-2 rounded-[10px] outline-none bg-[#455561] text-white md:p-4"
                        placeholder="Enter the username..."
                        id="username"
                        maxLength="10"
                        minLength="3"
                        required
                        value={username}
                        onChange={handleUsernameInput}
                        disabled={isLoading}
                        ref={inp}
                    />
                </div>

                <div className="flex pt-2 justify-between gap-4 items-center">
                    <Button
                        text="Cancel"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={() => setIsChangeUsername(false)}
                    />
                    <Button
                        text="Change Username"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={handleChangeUsername}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChangeUsername
