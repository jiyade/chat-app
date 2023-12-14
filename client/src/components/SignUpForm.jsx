import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import Button from './Button'
import Loader from './Loader'
import { updateUser } from '../slices/userSlice'
import { HiEye, HiEyeSlash, HiCamera } from 'react-icons/hi2'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/auth/signup`

const SignUpForm = ({ children }) => {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    const passInp = useRef(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleNameInput = (e) => {
        setName(e.target.value)
        if (name.length > 20) {
            name.slice(-1, 1)
        }
    }

    const handleUsernameInput = (e) => {
        setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))
        if (username.length > 10) {
            username.slice(-1, 1)
        }
        if (username.includes(' ')) {
            username.replace(/\s/g, '')
        }
    }

    const handlePasswordInput = (e) => {
        setPassword(e.target.value.toLowerCase().replace(/\s/g, ''))
        if (password.includes(' ')) {
            password.replace(/\s/g, '')
        }
    }

    const handlePasswordShow = () => {
        if (passInp.current.type === 'password') {
            passInp.current.type = 'text'
        } else {
            passInp.current.type = 'password'
        }

        setIsPasswordHidden((prev) => !prev)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (username && password && name) {
            const userData = {
                name,
                username: username.toLowerCase().replace(/\s/g, ''),
                password: password.toLowerCase().replace(/\s/g, '')
            }

            try {
                setIsLoading(true)
                const { data } = await axios.post(BASE_URL, userData)
                if (data.status === 'success') {
                    dispatch(updateUser(data.user))
                    localStorage.setItem('token', data.token)

                    setTimeout(() => {
                        setIsLoading(false)
                        toast.success('Account created!')
                    }, 600)

                    setTimeout(() => {
                        navigate('/app/chats', { replace: true })
                    }, 1000)
                    setUsername('')
                    setName('')
                    setPassword('')
                }
            } catch (err) {
                setIsLoading(false)
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            }
        }
    }

    return (
        <>
            <form
                className="w-4/5 py-10 flex flex-col gap-6 border-2 border-gray-500 rounded-2xl px-4 items-center"
                onSubmit={handleSubmit}
            >
                <div className="w-full text-base md:text-lg">
                    <label htmlFor="name" className="capitalize text-white">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="border-2 w-full px-2 py-2 md:py-4 rounded-[10px] outline-none bg-[#455561] text-white"
                        placeholder="Enter your name..."
                        id="name"
                        maxLength="20"
                        minLength="3"
                        required
                        value={name}
                        onChange={handleNameInput}
                        disabled={isLoading}
                    />
                </div>
                <div className="w-full text-base md:text-lg">
                    <label htmlFor="username" className="capitalize text-white">
                        username:
                    </label>
                    <input
                        type="text"
                        className="border-2 outline-none w-full px-2 py-2 md:py-4 rounded-[10px] bg-[#455561] text-white"
                        placeholder="Enter your username..."
                        id="username"
                        maxLength="10"
                        minLength="3"
                        required
                        value={username}
                        onChange={handleUsernameInput}
                        disabled={isLoading}
                    />
                </div>
                <div className="w-full text-base md:text-lg">
                    <label htmlFor="password" className="capitalize text-white">
                        password:
                    </label>
                    <div className="bg-[#455561] flex items-center border-2 rounded-[10px] px-1 w-full">
                        <input
                            type="password"
                            className="outline-none rounded-[10px] w-full px-2 py-2 md:py-4 bg-[#455561] text-white"
                            placeholder="Enter your password..."
                            id="password"
                            minLength="8"
                            required
                            value={password}
                            onChange={handlePasswordInput}
                            disabled={isLoading}
                            ref={passInp}
                        />
                        <span onClick={handlePasswordShow}>
                            {isPasswordHidden ? (
                                <HiEye size="1.1em" color="#fff" />
                            ) : (
                                <HiEyeSlash size="1.1em" color="#fff" />
                            )}
                        </span>
                    </div>
                </div>
                <Button text="sign up" />

                {children}
            </form>

            {isLoading && <Loader />}
        </>
    )
}

export default SignUpForm
