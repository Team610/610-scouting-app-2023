import {
    AppShell,
    Footer,
    Group,
    Header,
    Text
} from "@mantine/core"

export const ApplicationContainer = ({children}) => {
    return(
        <AppShell
        styles={{
            main:{background: "#191A19",
        width: "100vw",
    height: "100vh",
paddingLeft:"0px",}
        }}
        header = {
            <Header height = {70} p="md">
                <div style={{display:"flex", alignItems: 'center', height:"100%"}}> 
                    <Text size="xl" weight = "bolder">Team 610 Stopwatch</Text>
                </div>
            </Header>
        }
        >
            {children}
        </AppShell>
    )
}