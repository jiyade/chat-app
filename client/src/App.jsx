import { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import FullPageLoader from './components/FullPageLoader'

const ProtectedRoute = lazy(() => import('./pages/ProtectedRoute'))
const AppLayout = lazy(() => import('./pages/AppLayout'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Chats = lazy(() => import('./pages/Chats'))
const SingleChat = lazy(() => import('./pages/SingleChat'))
const Account = lazy(() => import('./pages/Account'))
const Search = lazy(() => import('./pages/Search'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))

const App = () => {
    const [roomId, setRoomId] = useState('')

    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<FullPageLoader />}>
                    <Routes>
                        <Route
                            path="/"
                            element={<Navigate replace to="/login" />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/app"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route path="chats" element={<Chats />} />
                            <Route
                                path="chats/:receiverId"
                                element={
                                    <SingleChat
                                        roomId={roomId}
                                        setRoomId={setRoomId}
                                    />
                                }
                            />
                            <Route
                                path="search"
                                element={<Search setRoomId={setRoomId} />}
                            />
                            <Route path="account" element={<Account />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>

            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                toastOptions={{
                    success: {
                        duration: 3000
                    },
                    error: {
                        duration: 3000
                    },
                    style: {
                        fontSize: '16px',
                        maxWidth: '500px',
                        padding: '16px 24px',
                        backgroundColor: '#577578',
                        color: '#fff',
                        textAlign: 'center'
                    }
                }}
            />
        </>
    )
}

export default App
