import { Outlet } from 'react-router-dom'

const AppLayout = () => {
    return (
        <main className="w-full min-h-[100dvh] bg-main-bg relative">
            <Outlet />
        </main>
    )
}

export default AppLayout
