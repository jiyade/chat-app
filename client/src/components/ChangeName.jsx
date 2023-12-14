import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateName } from '../slices/userSlice'
import { toast } from 'react-hot-toast'
import Button from './Button'
import axios from 'axios'

const BASE_URL = `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`

const ChangeName = ({
    setIsChangeName,
    userId,
    currentName,
    token,
    setIsLoading,
    isLoading
}) => {
    const [name, setName] = useState('')

    const inp = useRef(null)

    const dispatch = useDispatch()

    const handleNameInput = (e) => {
        setName(e.target.value)
        if (name.length > 20) {
            name.slice(-1, 1)
        }
    }

    const handleChangeName = async () => {
        if (name.length >= 3) {
            if (name !== currentName) {
                try {
                    setIsLoading(true)
                    const { data } = await axios.patch(
                        `${BASE_URL}/users/${userId}`,
                        { updateValue: { name } },
                        {
                            headers: {
                                authorization: `Bearer ${token}`
                            }
                        }
                    )

                    localStorage.setItem('token', data.token)
                    dispatch(updateName(data.user.name))
                    toast.success('Name changed!')
                } catch (err) {
                    if (err?.response?.data?.msg) {
                        toast.error(err?.response?.data?.msg)
                    } else {
                        console.log(err)
                    }
                } finally {
                    setIsChangeName(false)
                    setIsLoading(false)
                }
            } else {
                toast.error('New name cannot be the same as the old name')
            }
        } else {
            toast.error('Name must contain atleast 3 letters')
        }
    }

    useEffect(() => {
        inp.current.focus()
    }, [])

    return (
        <div className="text-white w-full h-full absolute top-0 flex justify-center items-center z-20">
            <div className="bg-header-bg flex flex-col justify-center gap-1 px-4 py-6 rounded-xl w-[95%] md:py-10 md:w-4/6 md:gap-6 md:rounded-2xl">
                <div className="md:text-2xl">
                    <label htmlFor="name" className="capitalize text-white">
                        Name:
                    </label>
                    <input
                        type="text"
                        className="border-2 w-full p-2 mt-2 rounded-[10px] outline-none bg-[#455561] text-white md:p-4"
                        placeholder="Enter the name..."
                        id="name"
                        maxLength="20"
                        minLength="3"
                        required
                        value={name}
                        onChange={handleNameInput}
                        disabled={isLoading}
                        ref={inp}
                    />
                </div>

                <div className="flex pt-2 justify-between gap-4 items-center">
                    <Button
                        text="Cancel"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={() => setIsChangeName(false)}
                    />
                    <Button
                        text="Change Name"
                        styles="border-2 md:px-8 md:py-3"
                        onClick={handleChangeName}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChangeName
