import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '../slices/userSlice'
import { toast } from 'react-hot-toast'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

const useAuth = async () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = localStorage.getItem('token')

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated)

    useEffect(() => {
        if (!token || !isAuthenticated) {
            localStorage.removeItem('token')
            localStorage.removeItem('isAuthenticated')

            navigate('/login', { replace: true })
        }
    }, [token, navigate])

    try {
        const { data } = await axios.post(`${BASE_URL}/auth/verify`, {
            token: `Bearer ${token}`
        })
        dispatch(updateUser(data.user))
        localStorage.setItem('isAuthenticated', isAuthenticated)
    } catch (err) {
        toast.error(err?.response?.data?.msg)
    }

    return isAuthenticated
}

export default useAuth
