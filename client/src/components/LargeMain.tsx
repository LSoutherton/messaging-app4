import React, { useEffect, useState, useRef } from "react";
import CreateIcon from "@mui/icons-material/Create";
import Conversation from "./Conversation.tsx";
import UserFinder from "../apis/UserFinder";
import SuggestedUser from "./SuggestedUser.tsx";
import { selectUser } from "../features/userSlice.js";
import { useSelector } from "react-redux/es/hooks/useSelector";
import SendIcon from "@mui/icons-material/Send";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Link } from "react-router-dom";
import Message from "./Message.tsx";
import Messaging from "./Messaging.tsx";

//Defines types to be used below
type ListState = {
  id: number;
  username: string;
  password: string;
};

type MessagesListState = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  time: string;
  date: string;
};

type MessagesList = {
  id: number;
  sender_id: string;
  receiver_id: string;
  message: string;
  date: string;
  time: string;
  time_num: number;
};

const LargeMain = () => {
  //Sets states
  const currentUser = useSelector(selectUser);

  const [newMessage, setNewMessage] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [conversationMessage, setConversationMessage] = useState<string>("");
  //Final user is the selected user from the list of suggestions to send a message to
  const [finalUser, setFinalUser] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const [clickedUser, setClickedUser] = useState<string>("");

  const [messagesList, setMessagesList] = useState<MessagesListState[] | []>(
    []
  );
  const [filteredList, setFilteredList] = useState<ListState[] | []>([]);

  //Api call to get conversations for current user
  const getConversations = async () => {
    try {
      const response = await UserFinder.get(
        `/getMessages/${currentUser.username}`
      );
      setMessagesList(response.data.data.messages);
    } catch (err) {
      console.log(err);
    }
  };

  //Gets all users with usernames containing the input value
  const handleSearch = async () => {
    if (input) {
      try {
        const response = await UserFinder.get(`/${input}`);
        setFilteredList(response.data.data.users);
      } catch (err) {
        console.log(err);
      }
    } else {
      setFilteredList([]);
    }
  };

  //Triggers on input change
  useEffect(() => {
    handleSearch();
  }, [input]);

  //Triggers on messagesList change
  useEffect(() => {
    getConversations();
  }, [messagesList]);

  //Triggers on page load. This will make an api call every 5 seconds to make sure that any new messages are displayed.
  useEffect(() => {
    const intervalId = setInterval(() => {
      getConversations();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  //Maps over the filteredList to create a list of componets for all suggested users
  const renderedList = filteredList.map((user: ListState) => {
    return (
      <SuggestedUser
        setUser={setFinalUser}
        username={user.username}
        id={user.id}
      />
    );
  });

  const createConversation = async (e) => {
    //Prevents page refresh
    e.preventDefault();

    const today = new Date();
    const dateString = today.toDateString();

    const hours = today.getHours();
    let stringHours = today.getHours().toString();
    //Makes sure that the string hours are displayed in the correct format. For example 09:00 rather than 9:00
    if (hours < 10) {
      stringHours = "0" + today.getHours().toString();
    }

    //Same as above but for minutes
    const minutes = today.getMinutes();
    let stringMinutes = today.getMinutes().toString();
    if (minutes < 10) {
      stringMinutes = "0" + today.getMinutes().toString();
    }

    const currentTime = stringHours + ":" + stringMinutes;

    //This will help us compare how recent 2 conversations are later
    const time_num = Number(stringHours + stringMinutes);

    //Checks that required inputs are provided
    if (!finalUser || !conversationMessage) {
      alert(
        "To send a message you must select a recipient and provide the message body."
      );
    } else {
      //Checks that you aren't trying to message yourself
      if (finalUser === currentUser.username) {
        alert("Please enter a different user");
        setFinalUser("");
        setInput("");
      } else {
        //Adds the message to the db
        try {
          const response = await UserFinder.post("/sendMessage", {
            sender: currentUser.username,
            receiver: finalUser,
            message: conversationMessage,
            date: dateString,
            date_calc: today,
            time: currentTime,
            time_num,
          });
          setNewMessage(false);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  //When newMessage changes, these values are reset
  useEffect(() => {
    if (!newMessage) {
      setInput("");
      setFinalUser("");
      setConversationMessage("");
      getConversations();
    }
  }, [newMessage]);

  //Clears inputs
  const handleClear = (e) => {
    e.preventDefault();

    setFinalUser("");
    setInput("");
  };

  //Searches all conversations
  const getSearch = () => {
    //Checks that the user has inputted something into the search bar
    if (!search) {
      return messagesList;
    }

    //Filters the conversations and displays those for users containing the search input
    return messagesList.filter((message) => {
      if (message.sender_id === currentUser.username) {
        return message.receiver_id.toLowerCase().includes(search.toLowerCase());
      } else {
        return message.sender_id.toLowerCase().includes(search.toLowerCase());
      }
    });
  };

  const searchedList = getSearch();

  //Maps over the searchedList to create the conversation components
  //Also checks if the most recent message is from the sender or receiver
  const renderConversations = searchedList.map((message: MessagesListState) => {
    if (message.sender_id === currentUser.username) {
      return (
        <Conversation
          user={message.receiver_id}
          message={message.message}
          time={message.time}
          date={message.date}
          id={message.id}
          newM={true}
          large={true}
          setUser={setClickedUser}
          selected={clickedUser === message.receiver_id}
        />
      );
    } else {
      return (
        <Conversation
          user={message.sender_id}
          message={message.message}
          time={message.time}
          date={message.date}
          id={message.id}
          newM={false}
          large={true}
          setUser={setClickedUser}
          selected={clickedUser === message.sender_id}
        />
      );
    }
  });

  //ABOVE IS FROM MAIN
  //BELOW IS FROM MESSAGING

  //Sets state values
  const [message, setMessage] = useState<string>("");

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [userMessages, setUserMessages] = useState<MessagesList[] | []>([]);

  //Checks to make sure that there is a conversation that has been clicked into and gets messages for that user from the db
  const getMessages = async () => {
    try {
      if (clickedUser != "") {
        const response = await UserFinder.get(
          `/getConversation/${clickedUser}/${currentUser.username}`
        );
        setUserMessages(response.data.data.messages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Runs getMessages when a new user is clicked
  useEffect(() => {
    getMessages();
  }, [clickedUser]);

  //Refreshes messages every 10 seconds by performing a get request
  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessages();
    }, 10000);
    return () => clearInterval(intervalId);
  }, [clickedUser]);

  //Scrolls to the bottom message when total number of messages in the conversation increases
  useEffect(() => {
    if (userMessages.length > 2) {
      messagesRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (userMessages.length > 0) {
      //Saves the id of the most recent message into localstorage. This acts as the most recent read message id.
      const messageId = userMessages[userMessages.length - 1].id;
      localStorage.setItem(`${clickedUser}`, JSON.stringify(messageId));
    }
  }, [userMessages.length]);

  //Maps over userMessages to create a list of message components
  //The self varaible tells us if it was sent by the current user or not.
  const renderMessages = userMessages.map((message: MessagesList) => {
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
    //Prevents page refresh
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

    //Sends alert if there is no selected user or message
    if (!clickedUser || !message) {
      alert("To send a message you must provide the message body.");
    } else {
      //Sends the message to db
      try {
        const response = await UserFinder.post("/sendMessage", {
          sender: currentUser.username,
          receiver: clickedUser,
          message,
          date: dateString,
          date_calc: today,
          time: currentTime,
          time_num,
        });
        //Sets the current message body to be empty then gets the messages from db
        setMessage("");
        getMessages();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="grid grid-cols-5">
      <div className="bg-gray-100 w-full h-screen p-2 sticky top-0 col-span-2 border-r-2 border-orange-500">
        <div>
          <h1 className="text-orange-500 text-4xl inline-block ml-2">
            Messages
          </h1>
          <button
            onClick={() => setNewMessage((prev) => !prev)}
            className="text-orange-500 absolute right-2 cursor-pointer"
          >
            <CreateIcon fontSize="large" />
          </button>
        </div>
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded mt-2 mb-2 p-2"
          type="text"
          placeholder="Search..."
        ></input>
        {messagesList.length ? (
          renderConversations
        ) : (
          <div className="text-lg w-11/12 text-center border-t-2 border-b-2 border-orange-500 p-4 mt-2 text-orange-500 flex m-auto">
            Welcome {currentUser.username}, click the pencil icon above to start
            your first conversation!
          </div>
        )}
        <div
          className={`text-6xl absolute top-12 left-0 right-0 m-auto w-97 bg-gray-200 h-full text-white duration-500 ease-out transition-all p-2 pl-4 pr-4 rounded-xl ${
            !newMessage ? "-translate-x-full opacity-0" : "opacity-100 "
          }`}
        >
          <h1 className="text-3xl text-orange-500">New Message</h1>
          <form onSubmit={createConversation} className="mt-2 p-2">
            <label className="inline-block text-2xl text-orange-500">
              To
              <button
                onClick={(e) => handleClear(e)}
                className="bg-orange-500 right-6 absolute inline-block text-xl pl-2 pr-2 rounded-lg text-white mt-1 cursor-pointer"
              >
                Clear
              </button>
            </label>
            <input
              value={finalUser ? finalUser : input}
              onChange={(e) => setInput(e.target.value)}
              className="border-2 border-orange-500 rounded w-full pl-1 h-10 text-base text-orange-500 flex mt-2"
              placeholder="User"
              name="user"
              type="text"
            ></input>
            <div
              className={`absolute w-full left-0 right-0 m-auto pl-2 pr-2 bg-gray-200 ${
                finalUser ? "hidden" : ""
              }`}
            >
              {renderedList}
            </div>
            <label className="block text-2xl mt-4 text-orange-500">
              Message
            </label>
            <textarea
              value={conversationMessage}
              onChange={(e) => setConversationMessage(e.target.value)}
              className="border-2 border-orange-500 rounded w-full pl-1 h-20 text-base text-orange-500"
              placeholder="Type your message here..."
              name="message"
            ></textarea>
          </form>
          <button
            onClick={createConversation}
            type="submit"
            className="flex m-auto pl-2 pr-2 p-1 text-xl mb-2 rounded text-white bg-orange-500 cursor-pointer"
          >
            Send Message
          </button>
        </div>
      </div>
      <div className="col-span-3">
        <div className="min-h-screen w-full">
          <div className="">
            <div className="pt-2 pb-2 text-center bg-gray-200 border-b-2 border-orange-500 mb-2 sticky top-0 z-1000 p-4 h-16">
              <h1 className="text-3xl text-orange-500 font-semibold mt-1">
                {clickedUser}
              </h1>
            </div>
            <div className="overflow-auto">{renderMessages}</div>
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
    </div>
  );
};

export default LargeMain;
