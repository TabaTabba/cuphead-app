import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  theme: "default" | "cuphead" | "mugman";
}

const initialState: ThemeState = {
  theme: "default",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (
      state,
      action: PayloadAction<"default" | "cuphead" | "mugman">
    ) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
