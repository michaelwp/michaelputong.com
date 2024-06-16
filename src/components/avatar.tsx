import avatar from "../assets/avatar.png";

const Avatar = () => {
    return (
        <>
            <img src={avatar} alt={"michael putong"}
                 className={"xl:w-96 l:w-96 md:w-96 w-full rounded-2xl xl:border l:border border border-gray-500"}/>
        </>
    )
}

export default Avatar;