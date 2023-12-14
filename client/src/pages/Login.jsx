import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import Loader from '../components/Loader'

const Login = () => {
    const navigate = useNavigate()

    const token = localStorage.getItem('token')
    const isAuthenticated = localStorage.getItem('isAuthenticated')

    useEffect(() => {
        if (token && isAuthenticated) {
            navigate('/app/chats', { replace: true })
        }
    }, [token, isAuthenticated])

    return (
        <div className="w-full min-h-[100dvh] bg-main-bg flex flex-col items-center justify-center gap-10 px-2 py-8">
            <h1 className="text-white text-4xl md:text-5xl font-semibold">
                Login
            </h1>
            <LoginForm>
                <div>
                    <h3 className="text-xs -mt-4 text-white font-medium md:text-base">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500">
                            Sign Up
                        </Link>
                    </h3>
                </div>
            </LoginForm>
        </div>
    )
}

export default Login
