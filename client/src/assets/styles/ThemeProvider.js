import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import React from 'react'
const theme = createMuiTheme({
    typography : {
        fontFamily : 'Poppins,Segoe UI,SegoeuiPc,San Francisco,Helvetica Neue,Helvetica,Lucida Grande,Roboto,Ubuntu,Tahoma,Microsoft Sans Serif,Arial,sans-serif'
    }
})
function CustomStyle({children}) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}

export default CustomStyle
