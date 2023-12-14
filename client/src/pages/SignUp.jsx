import { Link } from 'react-router-dom'
import SignUpForm from '../components/SignUpForm'

const SignUp = () => {
    return (
        <div className="w-full min-h-[100dvh] bg-main-bg flex flex-col items-center justify-center gap-10 px-2 py-8">
            <h1 className="text-white text-4xl md:text-5xl font-semibold">
                Sign Up
            </h1>
            <SignUpForm>
                <div>
                    <h3 className="text-xs -mt-4 text-white font-medium md:text-base">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500">
                            Login
                        </Link>
                    </h3>
                </div>
            </SignUpForm>
        </div>
    )
}

export default SignUp
