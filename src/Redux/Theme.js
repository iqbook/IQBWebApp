const initialTheme = localStorage.getItem("Theme") || "Dark";

export const ThemeSelectorReducer = (state = initialTheme, action) => {
    switch (action.type) {
        case "SET_THEME":
            return action.payload;

        default:
            return state;
    }
};


