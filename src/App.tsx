import Title from "./components/title.tsx";
import Body from "./components/body.tsx";
import Avatar from "./components/avatar.tsx";
import Social from "./components/social.tsx";

function App() {
    return (
        <>
            <div className={"w-full xl:pl-10 xl:pr-10 lg:pl-10 lg:pr-10 md:pl-5 md:pr-5 pl-3 pr-3"}>
                <Social/>
            </div>
            <hr className={"mt-5"}/>
            <div className={`flex xl:flex-row lg:flex-row flex-col 
                             items-center 
                             xl:pt-10 lg:pt-10 p-10 pt-5 
                             w-full 
                             justify-center`}>
                <div className={"p-2 pr-5"}>
                    <Avatar/>
                </div>
                <div className={"text-white flex flex-col space-y-2"}>
                    <div className={"flex flex-col m-2"}>
                        <Title/>
                    </div>
                    <div className={"flex flex-col m-2 justify-end"}>
                        <Body/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
