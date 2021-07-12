import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import { deepPurple } from '@material-ui/core/colors'
import React from 'react'
const theme = createMuiTheme({
    typography : {
        fontFamily : 'Poppins,Segoe UI,SegoeuiPc,San Francisco,Helvetica Neue,Helvetica,Lucida Grande,Roboto,Ubuntu,Tahoma,Microsoft Sans Serif,Arial,sans-serif'
    },
    palette : {
        primary : {
            main : deepPurple.A400,
        },
        type:'light'
    },
    overrides : {
        MuiButton : {
            root : {
                textTransform : 'initial',
            }
        },
        MuiIconButton : {
            root : {
                padding : '8px'
            }
        },
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
