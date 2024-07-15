import { MD3LightTheme as DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  version: 3,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#B9052C",
  },
  dark: true,
  mode: "adaptive",
};
