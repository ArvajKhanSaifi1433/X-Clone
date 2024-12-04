import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tweets: [],
  refresh: false,
  activeTab: true,
};

const tweetSlice = createSlice({
  name: "tweet",
  initialState,
  reducers: {
    getAllTweets(state, action) {
      state.tweets = action.payload;
    },
    getRefresh(state, action) {
      state.refresh = !state.refresh;
    },
    getIsActive(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const { getAllTweets, getRefresh, getIsActive } = tweetSlice.actions;

export default tweetSlice.reducer;
