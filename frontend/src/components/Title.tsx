import { useState } from 'react'
import axios from "axios"
import logo from "../assets/logo.png"

type Props = {
    setMessages: any;
}

function Title({setMessages}: Props) {
    const [isResetting, setIsResetting] = useState(false);

    // Reset the conversation
    const resetConversation = async() => {
        setIsResetting(true);

        await axios.get("http://localhost:8000/reset").then((res) => {
            if(res.status == 200) {
                setMessages([]);
            } else {
                console.error("There was an error with the API request to backend.");
            }
        }).catch((err) => {
            console.error(err.message);
        })
        
        setIsResetting(false);
    }

    return (
        <div className='flex justify-between items-center w-full p-4 bg-primary text-white shadow'>
            <div className="flex items-center gap-2">
                <a
                    href="https://bryan-chavarria.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                    >
                    <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
                    <div className="flex flex-col gap-1">
                        <p className="text-white text-[-18px] font-bold cursor-pointer">
                            Bryan Chavarria
                        </p>
                        <span className="text-secondary font-medium flex-shrink-0">
                            Computer Science Engineer
                        </span>
                    </div>
                </a>
            </div>
            <div className="flex flex-col gap-1 justify-center">
                <p className="text-white text-[-18px] font-bold cursor-pointer">
                    Rachel <span className="text-secondary font-light pl-2 flex-shrink-0">
                            Voice Assistant
                        </span>
                </p>
            </div>
            <button 
                className={'transition-all duration-300 text-blur-300 hover:text-pink-500 ' + (isResetting && "animate-pulse")}
                onClick={resetConversation}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </div>
    )
}

export default Title