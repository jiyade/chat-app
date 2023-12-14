import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import Button from './Button'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const ChangePassword = ({
    setIsChangePassword,
    userId,
    token,
    setIsLoading,
    isLoading
}) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isOldPasswordHidden, setIsOldPasswordHidden] = useState(true)
    const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true)

    const oldPassInp = useRef(null)
    const newPassInp = useRef(null)

    const handleOldPasswordInput = (e) => {
        setOldPassword(e.target.value.toLowerCase().replace(/\s/g, ''))
        if (oldPassword.includes(' ')) {
            oldPassword.replace(/\s/g, '')
        }
    }
    const handleNewPasswordInput = (e) => {
        setNewPassword(e.target.value.toLowerCase().replace(/\s/g, ''))
        if (newPassword.includes(' ')) {
            newPassword.replace(/\s/g, '')
        }
    }

    const handleOldPasswordShow = () => {
        if (oldPassInp.current.type === 'password') {
            oldPassInp.current.type = 'text'
        } else {
            oldPassInp.current.type = 'password'
        }

        setIsOldPasswordHidden((prev) => !prev)
    }
    const handleNewPasswordShow = () => {
        if (newPassInp.current.type === 'password') {
            newPassInp.current.type = 'text'
        } else {
            newPassInp.current.type = 'password'
        }

        setIsNewPasswordHidden((prev) => !prev)
    }

    const handleChangePassword = async () => {
        if (oldPassword.length >= 8 && newPassword.length >= 8) {
            try {
                setIsLoading(true)
                const { data } = await axios.patch(
                    `${BASE_URL}/users/${userId}`,
                    {
                        oldPassword,
                        updateValue: { password: newPassword.toLowerCase() }
                    },
                    {
                        headers: {
                            authorization: `Bearer ${token}`
                        }
                    }
                )

                if (data.status) {
                    toast.success('Password changed!')
                }
            } catch (err) {
                if (err?.response?.data?.msg) {
                    toast.error(err?.response?.data?.msg)
                } else {
                    console.log(err)
                }
            } finally {
                setIsChangePassword(false)
                setIsLoading(false)
            }
        } else {
            toast.error('Password must contain atleast 8 letters')
        }
    }

    useEffect(() => {
        oldPassInp.current.focus()
    }, [])

    return (
        <div className="text-white w-full h-full absolute top-0 flex justify-center items-center z-20">
            <div className="bg-header-bg flex flex-col justify-center gap-2 px-4 py-6 rounded-xl w-[95%] md:py-10 md:w-4/6 md:gap-6 md:rounded-2xl">
                <div className="flex flex-col gap-1 md:gap-3 md:text-2xl">
                    <label
                        htmlFor="old-password"
                        className="capitalize text-white"
                    >
                        Old Password:
                    </label>
                    <div className="bg-[#455561] flex items-center border-2 rounded-[10px] px-1">
                        <input
                            type="password"
                            className="w-full p-2 rounded-[10px] outline-none bg-[#455561] text-white md:p-4"
                            placeholder="Enter the old password..."
                            id="old-password"
                            minLength="8"
                            required
                            value={oldPassword}
                            onChange={handleOldPasswordInput}
                            disabled={isLoading}
                            ref={oldPassInp}
                        />
                        <span onClick={handleOldPasswordShow}>
                            {isOldPasswordHidden ? (
                                <HiEye size="1.1em" color="#fff" />
                            ) : (
                                <HiEyeSlash size="1.1em" color="#fff" />
                            )}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col gap-1 md:gap-3 md:text-2xl">
                    <label htmlFor="password" className="capitalize text-white">
                        New Password:
                    </label>
                    <div className="bg-[#455561] flex items-center border-2 rounded-[10px] px-1">
                        <input
                            type="password"
                            className="w-full p-2 rounded-[10px] outline-none bg-[#455561] text-white md:p-4"
                            placeholder="Enter the new password..."
                            id="password"
                            minLength="8"
                            required
                            value={newPassword}
                            onChange={handleNewPasswordInput}
                            disabled={isLoading}
                            ref={newPassInp}
                        />
                        <span onClick={handleNewPasswordShow}>
                            {isNewPasswordHidden ? (
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
                        onClick={() => setIsChangePassword(false)}
                    />
                    <Button
                        text="Change Password"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={handleChangePassword}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
