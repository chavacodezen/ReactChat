import { useState } from "react";
import Title from "./Title";
import axios from "axios";
import RecordMessage from "./RecordMessage";

const Controller = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    function createBlobURL(data: any) {
        const blob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(blob);
        return url;
    }

    const handleStop = async (blobUrl: string) => {
        setIsLoading(true);

        // Append recorded message to messages
        const myMessage = { sender: "me", blobUrl };
        const messagesArr = [...messages, myMessage];

        // convert blob url to blob object
        fetch(blobUrl)
        .then((res) => res.blob())
        .then(async (blob) => {
            // Construct audio to send file
            const formData = new FormData();
            formData.append("file", blob, "myFile.wav");

            // send form data to api endpoint
            await axios
            .post("http://localhost:8000/post-audio", formData, {
                headers: {
                "Content-Type": "audio/mpeg",
                },
                responseType: "arraybuffer", // Set the response type to handle binary data
            })
            .then((res: any) => {
                const blob = res.data;
                const audio = new Audio();
                audio.src = createBlobURL(blob);

                // Append to audio
                const rachelMessage = { sender: "rachel", blobUrl: audio.src };
                messagesArr.push(rachelMessage);
                setMessages(messagesArr);

                // Play audio
                setIsLoading(false);
                audio.play();
            })
            .catch((err: any) => {
                console.error(err);
                setIsLoading(false);
            });
        });
    };

    return(
        <div className='h-screen overflow-y-hidden'>
            <Title setMessages={setMessages} />
            <div className='w-full  justify-between h-full overflow-y-scroll pb-96'>
                {/* Conversation */}
                <div className="mt-5 px-5 max-w-7xl mx-auto flex flex-col">
                    {messages.map((audio, index) => {
                        return (
                            <div 
                                key={index + audio.sender} 
                                className={"flex flex-col " + (audio.sender == "rachel" && "flex items-end")}
                            >
                                {/* Sender */}
                                <div className="mt-4">
                                    <p className={audio.sender == "rachel" ? "text-right mr-2 text-green-500": "ml-2 italic text-red-500"}>
                                        {audio.sender}
                                    </p>
                                    {/* Audio Message */}
                                    <audio src={audio.blobUrl} className="appearance-none" controls />
                                </div>
                            </div>
                        )
                    })}

                    {messages.length == 0 && !isLoading && (
                        <div className="text-center font-light italic text-white mt-10"> 
                            Send a message to Rachel.
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-center font-light italic text-white mt-10 animate-pulse"> 
                            Give me a few seconds please...
                        </div>
                    )}
                </div>
                {/* Recorder */}
                <div className='fixed bottom-0 w-full py-5 text-center bg-gradient-to-l from-[#915EFF] to-sky-900'>
                    <RecordMessage handleStop={handleStop} />
                </div>
            </div>
        </div>
    )
}

export default Controller