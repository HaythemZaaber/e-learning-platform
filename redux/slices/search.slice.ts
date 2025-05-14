import { createSlice } from "@reduxjs/toolkit";

interface SearchState {
  showNavbarSearch: boolean;
}

const initialState: SearchState = {
  showNavbarSearch: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setShowNavbarSearch: (state, action) => {
      state.showNavbarSearch = action.payload;
    },
  },
});

export const { setShowNavbarSearch } = searchSlice.actions;
export default searchSlice.reducer;
