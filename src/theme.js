import {createMuiTheme} from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

export const synthTheme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: purple[600],
    },
  },
});
