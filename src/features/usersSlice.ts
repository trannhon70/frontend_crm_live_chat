import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { userAPI } from '../apis/user.api.ts'



// First, create the thunk
export const fetchUserById = createAsyncThunk(
  'users/getByIdUser',
  async (thunkAPI) => {
    const response = await userAPI.getByIdUser()
    return response.data.data
  },
)



interface UsersState {

  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
  invalidToken: boolean
  data: any,
  pageSize: number,
  pageIndex: number,
  total: number,
  totalPages: number,

  user: any,
  title: string
}

const initialState = {

  loading: 'idle',
  invalidToken: false,
  data: [],
  pageSize: 5,
  pageIndex: 1,
  total: 0,
  totalPages: 0,
  user: {},
  title: "",

} satisfies UsersState as UsersState

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setInvalidToken(state, action) {
      state.invalidToken = action.payload;
    },
    setTitleInvalidToken(state, action) {
      state.title = action.payload;
    },
    setUser(state, action) {
      state.user = {
        ...state.user,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = 'succeeded';

    });

  },
})

export const { setInvalidToken, setTitleInvalidToken, setUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;