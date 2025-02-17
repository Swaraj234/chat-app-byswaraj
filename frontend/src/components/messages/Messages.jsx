import { useEffect, useRef} from "react";

import useGetMessage from "../../hooks/useGetMessage";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
// import useListenMessage from "../../hooks/useListenMessage";

const Messages = () => {
	const {messages, loading}= useGetMessage();
	useListenMessages();
	const lastMessageRef = useRef()
	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);
	// console.log("messages:",messages);
	return (
		<div className='px-4 flex-1 overflow-auto'>
		{!loading &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

		{loading && [...Array(3)].map((_,idx) => <MessageSkeleton key={idx} />)}
		{!loading && messages.length === 0 && (
			<p className='text-center text-white'>Send a message to start the conversation</p>
		)}
	</div>
			);
};
export default Messages;
