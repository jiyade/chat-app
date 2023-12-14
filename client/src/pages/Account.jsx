import { useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Setting from '../components//Setting'
import ChangeName from '../components/ChangeName'
import ChangeUsername from '../components/ChangeUsername'
import ChangePassword from '../components/ChangePassword'
import AccountDelete from '../components/AccountDelete'
import Loader from '../components/Loader'

const Account = () => {
    const [isChangeName, setIsChangeName] = useState(false)
    const [isChangeUsername, setIsChangeUsername] = useState(false)
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [isAccountDelete, setIsAccountDelete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const user = useSelector((state) => state.user)
    const navigate = useNavigate()

    const token = localStorage.getItem('token')

    const logOut = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('isAuthenticated')
        navigate('/')
    }

    return (
        <>
            <div
                className={
                    isChangeName ||
                    isChangeUsername ||
                    isChangePassword ||
                    isAccountDelete
                        ? 'bg-black opacity-60 min-h-[100dvh] w-full'
                        : ''
                }
            >
                <header className="flex gap-3 items-center py-3 px-4 bg-header-bg md:py-5 md:px-6">
                    <Link to="/app/chats">
                        <HiChevronLeft
                            color="white"
                            className="text-[1.5em] md:text-[2em]"
                        />
                    </Link>
                    <h1 className="text-2xl text-white font-medium md:text-3xl">
                        Account
                    </h1>
                </header>

                <div className="divide-y-2 md:divide-y-4 md:py-4">
                    <div className="flex flex-col gap-4 justify-center items-center py-10 md:py-16">
                        <img
                            src={user.profile}
                            alt="profile"
                            title="Profile"
                            className="rounded-full w-[90px] h-[90px] md:w-[120px] md:h-[120px]"
                        />
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                            <h2 className="text-white text-3xl font-medium md:text-6xl">
                                {user.name}
                            </h2>
                            <h3 className="text-white text-xs font-normal md:text-lg">
                                @{user.username}
                            </h3>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <ul className="flex flex-col gap-4 text-white md:gap-10">
                            <Setting onClick={() => setIsChangeName(true)}>
                                Change Name
                            </Setting>
                            <Setting onClick={() => setIsChangeUsername(true)}>
                                Change Username
                            </Setting>
                            <Setting onClick={() => setIsChangePassword(true)}>
                                Change Password
                            </Setting>
                            <Setting styles="text-red-500" onClick={logOut}>
                                Log Out
                            </Setting>
                            <Setting
                                styles="text-red-500"
                                onClick={() => setIsAccountDelete(true)}
                            >
                                Delete Account
                            </Setting>
                        </ul>
                    </div>
                </div>
            </div>

            {isChangeName && (
                <ChangeName
                    setIsChangeName={setIsChangeName}
                    userId={user.userId}
                    token={token}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    currentName={user.name}
                />
            )}
            {isChangeUsername && (
                <ChangeUsername
                    setIsChangeUsername={setIsChangeUsername}
                    userId={user.userId}
                    token={token}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                    currentUsername={user.username}
                />
            )}
            {isChangePassword && (
                <ChangePassword
                    setIsChangePassword={setIsChangePassword}
                    userId={user.userId}
                    token={token}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            )}
            {isAccountDelete && (
                <AccountDelete
                    setIsAccountDelete={setIsAccountDelete}
                    token={token}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                />
            )}

            {isLoading && <Loader />}
        </>
    )
}

export default Account
