import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import Button from './Button'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const AccountDelete = ({
    setIsAccountDelete,
    token,
    setIsLoading,
    isLoading
}) => {
    const [password, setPassword] = useState('')
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    const passInp = useRef(null)

    const navigate = useNavigate()

    const handlePasswordInput = (e) => {
        setPassword(e.target.value.toLowerCase())
    }

    const handlePasswordShow = () => {
        if (passInp.current.type === 'password') {
            passInp.current.type = 'text'
        } else {
            passInp.current.type = 'password'
        }

        setIsPasswordHidden((prev) => !prev)
    }

    const handleAccountDelete = async () => {
        if (password.length >= 8) {
            try {
                setIsLoading(true)
                const { data } = await axios.delete(
                    `${BASE_URL}/users/delete-account`,
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        },

                        data: { password }
                    }
                )

                if (data.status === 'success') {
                    localStorage.removeItem('token')
                    localStorage.removeItem('isAuthenticated')
                    navigate('/')
                    toast.success('Account deleted!')
                }
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            } finally {
                setIsAccountDelete(false)
                setIsLoading(false)
            }
        } else {
            toast.error('Password must contain atleast 8 letters')
        }
    }

    useEffect(() => {
        passInp.current.focus()
    }, [])

    return (
        <div className="text-white w-full h-full absolute top-0 flex justify-center items-center z-20">
            <div className="bg-header-bg flex flex-col justify-center gap-1 px-4 py-6 rounded-xl w-[95%] md:py-10 md:w-4/6 md:gap-6 md:rounded-2xl">
                <div className="flex flex-col gap-1 md:gap-3 md:text-2xl">
                    <label htmlFor="password" className="capitalize text-white">
                        Password:
                    </label>
                    <div className="bg-[#455561] flex items-center border-2 rounded-[10px] px-1">
                        <input
                            type="password"
                            className="w-full p-2 rounded-[10px] outline-none bg-[#455561] text-white md:p-4"
                            placeholder="Enter the password..."
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

                <div className="flex pt-2 justify-between gap-4 items-center">
                    <Button
                        text="Cancel"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={() => setIsAccountDelete(false)}
                    />
                    <Button
                        text="Delete Account"
                        styles="border-2 bg-red-500 md:px-8 md:py-3"
                        onClick={handleAccountDelete}
                    />
                </div>
            </div>
        </div>
    )
}

export default AccountDelete
