import React, { useState, useEffect, useRef } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Message from "./Message.tsx";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import { selectUser } from "../features/userSlice.js";
import { useSelector } from "react-redux/es/hooks/useSelector";
import SendIcon from "@mui/icons-material/Send";

type MessagesList = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  date: string;
  time: string;
  time_num: number;
};

const Messaging = ({ user }) => {
  const [screenSize, setScreenSize] = useState(window.innerWidth < 900);

  const updateView = () => {
    setScreenSize(window.innerWidth < 900);
  };

  useEffect(() => {
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  });

  const location = useLocation();
  const currentUser = useSelector(selectUser);

  const userConversation = user || location.state.user;

  const [message, setMessage] = useState<string>("");

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [messagesList, setMessagesList] = useState<MessagesList[] | []>([]);

  const getMessages = async () => {
    try {
      const response = await UserFinder.get(
        `/getConversation/${userConversation}/${currentUser.username}`
      );
      setMessagesList(response.data.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMessages();
  }, [userConversation]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessages();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    if (messagesList.length > 0) {
      const messageId = messagesList[messagesList.length - 1].id;
      localStorage.setItem(`${userConversation}`, JSON.stringify(messageId));
    }
  }, [messagesList.length]);

  const renderMessages = messagesList.map((message: MessagesList) => {
    let self = false;
    if (message.sender_id === currentUser.username) {
      self = true;
    }
    return (
      <Message
        self={self}
        body={message.message}
        time={message.time}
        date={message.date}
      />
    );
  });

  const sendMessage = async (e) => {
    e.preventDefault();

    const today = new Date();
    const dateString = today.toDateString();

    const hours = today.getHours();
    let stringHours = today.getHours().toString();
    if (hours < 10) {
      stringHours = "0" + today.getHours().toString();
    }

    const minutes = today.getMinutes();
    let stringMinutes = today.getMinutes().toString();
    if (minutes < 10) {
      stringMinutes = "0" + today.getMinutes().toString();
    }

    const currentTime = stringHours + ":" + stringMinutes;

    const time_num = Number(stringHours + stringMinutes);

    if (!userConversation || !message) {
      alert("To send a message you must provide the message body.");
    } else {
      try {
        const response = await UserFinder.post("/sendMessage", {
          sender: currentUser.username,
          receiver: userConversation,
          message,
          date: dateString,
          date_calc: today,
          time: currentTime,
          time_num,
        });
        setMessage("");
        getMessages();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {screenSize ? (
        <>
          <div className="min-h-screen">
            <div className="">
              <div className="pt-2 pb-2 grid grid-cols-3 bg-gray-200 border-b-2 border-orange-500 mb-2 sticky top-0 z-1000 p-4 h-16">
                <Link to="/main">
                  <ChevronLeftIcon
                    className="float-left ml-4 mt-2 text-orange-500"
                    fontSize="large"
                  />
                </Link>
                <h1 className="text-3xl text-orange-500 font-semibold flex m-auto">
                  {userConversation}
                </h1>
              </div>
              <div className="overflow-scroll h-fit">{renderMessages}</div>
            </div>
            <div ref={messagesRef}></div>
          </div>
          <div className="bg-gray-200 w-full p-3 sticky bottom-0 border-t-2 border-orange-500">
            <form onSubmit={(e) => sendMessage(e)} className="grid grid-cols-6">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-5 border-2 border-orange-500 rounded w-full pl-1 h-10 text-base text-orange-500 flex ml-2"
                placeholder="Type..."
                name="message"
                type="text"
              ></input>
              <SendIcon
                onClick={sendMessage}
                type="submit"
                className="text-orange-500 flex m-auto cursor-pointer"
                fontSize="large"
              />
            </form>
          </div>
        </>
      ) : (
        <div className="col-span-3">
          <div className="min-h-screen">
            <div className="">
              <div className="pt-2 pb-2 text-center bg-gray-200 border-b-2 border-orange-500 mb-2 fixed top-0 z-1000 p-4 h-16">
                <h1 className="text-3xl text-orange-500 font-semibold mt-1">
                  {userConversation}
                </h1>
              </div>
              <div className="overflow-scroll h-fit">{renderMessages}</div>
            </div>
            <div ref={messagesRef}></div>
          </div>
          <div className="bg-gray-200 w-full p-3 sticky bottom-0 border-t-2 border-orange-500">
            <form onSubmit={(e) => sendMessage(e)} className="grid grid-cols-6">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="col-span-5 border-2 border-orange-500 rounded w-full pl-1 h-10 text-base text-orange-500 flex ml-2"
                placeholder="Type..."
                name="message"
                type="text"
              ></input>
              <SendIcon
                onClick={sendMessage}
                type="submit"
                className="text-orange-500 flex m-auto cursor-pointer"
                fontSize="large"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Messaging);
