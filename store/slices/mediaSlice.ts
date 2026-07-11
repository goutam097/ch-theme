import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { MediaAsset } from "@/types";

interface MediaState {
  assets: MediaAsset[];
}

const initialState: MediaState = {
  assets: [],
};

/**
 * A lightweight media library. In production `addMedia` would be dispatched
 * after an upload to object storage resolves; here it tracks URLs the user has
 * referenced so they can be reused across sections.
 */
const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    addMedia: (state, action: PayloadAction<MediaAsset>) => {
      if (!state.assets.some((a) => a.url === action.payload.url)) {
        state.assets.unshift(action.payload);
      }
    },
    removeMedia: (state, action: PayloadAction<string>) => {
      state.assets = state.assets.filter((a) => a.id !== action.payload);
    },
    clearMedia: (state) => {
      state.assets = [];
    },
  },
});

export const { addMedia, removeMedia, clearMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
