import Title from "./components/title.tsx";
import Body from "./components/body.tsx";
import Avatar from "./components/avatar.tsx";

function App() {
    return (
        <div className={"flex xl:flex-row lg:flex-row flex-col items-center p-10 w-full justify-center"}>
            <div className={"p-2"}>
                <Avatar/>
            </div>
            <div className={"m-2"}/>
            <div className={"text-white flex flex-col space-y-2"}>
                <div className={"flex flex-col m-2"}>
                    <Title/>
                </div>
                <div className={"flex flex-col m-2 justify-end"}>
                    <Body/>
                </div>
            </div>
        </div>
    )
}

export default App
