import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  otherUsers: [],
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser(state, action) {
      state.user = action.payload;
    },
    getOtherUsers(state, action) {
      state.otherUsers = action.payload;
    },
    getMyProfile(state, action) {
      state.profile = action.payload;
    },
    toggleBookmark(state, action) {
      const bookmarkId = action.payload;
      // Initialize bookmarks if they don't exist
      if (!state.user?.bookmarks) {
        state.user.bookmarks = [];
      }
      // Toggle bookmark
      if (state.user.bookmarks.includes(bookmarkId)) {
        // Remove bookmark
        state.user.bookmarks = state.user.bookmarks.filter((item) => item !== bookmarkId);
      } else {
        // Add bookmark
        state.user.bookmarks.push(bookmarkId);
      }
    },
    toggleFollow(state, action) {
      const followerId = action.payload;
      // Initialize following if it doesn't exist
      if (!state.user?.following) {
        state.user.following = [];
      }
      // Toggle follow status
      if (state.user.following.includes(followerId)) {
        // Remove follower
        state.user.following = state.user.following.filter((item) => item !== followerId);
      } else {
        // Add follower
        state.user.following.push(followerId);
      }
    },
  },
});

// Export the actions
export const { getUser, getOtherUsers, getMyProfile, toggleBookmark, toggleFollow } = userSlice.actions;

export default userSlice.reducer;
