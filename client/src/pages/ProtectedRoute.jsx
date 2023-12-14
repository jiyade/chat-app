import useAuth from "../hooks/useAuth"

const ProtectedRoute = ({children}) => {
  const isAuthenticated = useAuth()
  
  return isAuthenticated ? children: null 
}

export default ProtectedRoute