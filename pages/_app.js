import '../styles/globals.css'
import {MantineProvider} from "@mantine/core"
import { ApplicationContainer } from '../components/ApplicationContainer'
function MyApp({Component, pageProps}) {
    return(
        <MantineProvider 
            withGlobalStyles
            withNormalizeCSS
            theme={{colorScheme: 'dark'}}
            >
                <ApplicationContainer>
                    <Component{...pageProps}/>
                </ApplicationContainer>
            </MantineProvider>
    )
}

export default MyApp