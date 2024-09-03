import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { selectUser } from "../features/userSlice.js";
import { useSelector } from "react-redux/es/hooks/useSelector";

//Defines the Props type and what parameters it will have
type Props = {
  user: string;
  message: string;
  time: string;
  date: any;
  id: number;
  newM: boolean;
  large: boolean;
  setUser: any;
  selected: boolean;
};

//Defines the component and its props. Uses the above Type in the definition
const Conversation: React.FC<Props> = ({
  user,
  message,
  time,
  date,
  id,
  newM,
  large,
  setUser,
  selected,
}) => {
  const current = new Date();
  const currentUser = useSelector(selectUser);

  let display = "";

  //Checks if the date is equal to current date. If so, shows the time, if not shows the date.
  if (current.toDateString() != date) {
    display = date;
  } else {
    display = time;
  }

  let elipsis = false;

  //Checks so see if the message is longer than 19 chars
  if (message.length > 19) {
    elipsis = true;
  }

  //Gets the currently stored value for 'user'
  //The storedValue is the last read message on this device
  const storedValue: string | null = localStorage.getItem(`${user}`);
  let storedNumber: number = 0;

  let newMessage = false;

  //Checks that 'user' is not null and parses the value if it is found
  if (storedValue) {
    storedNumber = JSON.parse(storedValue);
  }

  //Here, newM is used as a toggle to determine if the most recent message in a conversation was sent by the current user or if it was sent to them
  //Checks to see if the id of the last read message (storedNumber) is equal to the id of the most recent message in the conversation
  if (storedNumber != id && !newM) {
    newMessage = true;
  }

  //Sets the id of the most recent message into local storage as this will be the new most recent read message
  const handleClick = () => {
    localStorage.setItem(`${user}`, JSON.stringify(id));
    setUser(user);
  };

  //The component returns 2 different results depending on the screensize
  return (
    <>
      {large ? (
        <div
          onClick={handleClick}
          key={id}
          className={`grid grid-cols-7 border-2 rounded-xl ${
            selected ? "bg-orange-500 border-white" : "border-orange-500"
          } cursor-pointer mt-1 p-1 pb-2`}
        >
          <div className="col-span-4 pt-1 ml-4">
            <h1
              className={`text-2xl ${
                selected ? "text-white" : "text-orange-500"
              } font-semibold`}
            >
              {user}
            </h1>
            <h2
              className={`${
                newMessage ? "font-bold text-black" : ""
              }text-base ${selected ? "text-white" : "text-gray-500"}`}
            >
              {message.slice(0, 19)}
              {elipsis ? "..." : ""}
            </h2>
          </div>
          <div
            className={`col-span-3 text-sm ${
              selected ? "text-white" : "text-gray-500"
            } flex m-auto mr-2`}
          >
            {display}
            {newMessage ? (
              <div className="bg-green-500 w-4 h-4 rounded-full mt-0.5 ml-2">
                <div className="bg-green-500 w-4 h-4 animate-ping rounded-full"></div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <Link
          key={id}
          to="/messaging/:id"
          state={{ user }}
          className="grid grid-cols-7 border-2 rounded-xl border-orange-500 cursor-pointer mt-1 p-1 pb-2"
        >
          <div className="col-span-4 pt-1 ml-4">
            <h1 className="text-2xl text-orange-500 font-semibold">{user}</h1>
            <h2
              className={`${
                newMessage ? "font-bold text-black" : ""
              }text-base text-gray-500`}
            >
              {message.slice(0, 19)}
              {elipsis ? "..." : ""}
            </h2>
          </div>
          <div className="col-span-3 text-sm text-gray-500 flex m-auto mr-2">
            {display}
            {newMessage ? (
              <div className="bg-green-500 w-4 h-4 rounded-full mt-0.5 ml-2">
                <div className="bg-green-500 w-4 h-4 animate-ping rounded-full"></div>
              </div>
            ) : (
              ""
            )}
          </div>
        </Link>
      )}
    </>
  );
};

export default React.memo(Conversation);
