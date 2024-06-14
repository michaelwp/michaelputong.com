import Contact from "./contact.tsx";
import Social from "./social.tsx";

const Body = () => {
    return (
        <>
            <div className={"flex flex-col space-y-1 m-2"}>
                <div>
                    I am a seasoned
                    <span className={"text-2xl font-normal text-blue-500 p-2"}>
                            Software Engineer
                        </span>
                    with over 10 years of experience, specializing in full-stack
                    development using
                    <span className={"text-2xl font-normal text-red-500 p-2"}>
                            React.Js
                        </span>,
                    <span className={"text-2xl font-normal text-green-500 p-2"}>
                            Node.Js
                        </span>, and
                    <span className={"text-2xl font-normal text-blue-500 p-2"}>
                            Go
                        </span>.
                </div>
                <div>
                    My diverse background includes roles in software development, IT support, and consulting,
                    enabling me to deliver robust and scalable solutions.
                </div>
            </div>
            <div className={"flex flex-col space-y-1 m-2"}>
                <div>
                    I am passionate about leveraging technology to solve complex problems and continuously enhancing
                    my
                    skills.
                </div>
                <div>
                    I am particularly interested in working in a global environment,
                    and
                    <span className={"italic m-1 text-gray-400 font-normal"}>
                            I am enthusiastic about the opportunity to relocate to different countries
                        </span>
                    , where I can immerse myself in their innovative tech scenes and rich cultural heritages.
                </div>
            </div>
            <div className={"flex flex-row space-x-1 items-center m-2"}>
                <span className={"text-sm text-gray-400"}>Contact Me via email :</span> <Contact/>
            </div>
            <hr className={"mt-5"}/>
            <div>
                <Social/>
            </div>
        </>
    )
}

export default Body;