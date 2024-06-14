import Title from "./components/title.tsx";
import Body from "./components/body.tsx";
import Avatar from "./components/avatar.tsx";

function App() {
    return (
        <div className={"flex flex-row items-center p-10 w-full justify-center"}>
            <div className={"p-2"}>
                <Avatar/>
            </div>
            <div className={"m-2"}/>
            <div className={"text-white flex flex-col font-extralight space-y-2"}>
                <div className={"flex flex-col m-2"}>
                    <Title/>
                </div>
                <div className={"flex flex-col m-2 justify-end"}>
                    <Body/>
                </div>npm
            </div>
        </div>
    )
}

export default App
