import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TemplateState {
  /** Currently selected template id, e.g. "template1". */
  activeTemplateId: string;
}

const initialState: TemplateState = {
  activeTemplateId: "template1",
};

/**
 * Stores only the active template id. Switching a template changes which
 * variants render — content is untouched because it lives in websiteSlice and
 * every template consumes the same data shape.
 */
const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<string>) => {
      state.activeTemplateId = action.payload;
    },
  },
});

export const { setTemplate } = templateSlice.actions;
export default templateSlice.reducer;
