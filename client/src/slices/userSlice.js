import { createSlice } from '@reduxjs/toolkit'

const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'))

const initialState = {
    userId: '',
    name: '',
    username: '',
    profile: '',
    isAuthenticated
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser(state, action) {
            
            state.userId = action.payload.userId
            state.name = action.payload.name
            state.username = action.payload.username
            state.profile = action.payload.profile
            state.isAuthenticated = true
        },
        updateName(state, action) {
            state.name = action.payload
        },
        updateUsername(state, action) {
            state.username = action.payload
        }
    }
})

export const { updateUser, updateName, updateUsername } = userSlice.actions
export default userSlice.reducer
