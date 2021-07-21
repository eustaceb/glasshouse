import {createTheme} from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

export const synthTheme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: purple[600],
    },
  },
});
