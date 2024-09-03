import React from "react";

//Defines type to be used lower down
type Props = {
  self: boolean;
  body: string;
  time: string;
  date: string;
};

//Defines component and props
const Message: React.FC<Props> = ({ self, body, time, date }) => {
  const today = new Date();

  //A toggle that switches if the message was sent on the current day.
  //If sent on the current day it will only display the time, otherwise it will diaply the date and time.
  let renderDateandTime: boolean;

  if (today.toDateString() === date) {
    renderDateandTime = true;
  } else {
    renderDateandTime = false;
  }

  return (
    <div
      className={`block w-10/12 ${
        self ? "float-right" : "float-left"
      } m-1 mt-3 overflow-hidden`}
    >
      <div
        className={`${
          self ? "text-right" : "text-left"
        } text-orange-500 font-semibold`}
      >
        {renderDateandTime ? time : time + " - " + date}
      </div>
      <div
        className={`text-2xl max-w-10-12 overflow-auto ${
          self
            ? "bg-orange-500 text-white float-right"
            : "bg-gray-200 text-orange-500 float-left"
        } pl-4 pr-4 p-1 rounded-2xl`}
      >
        {body}
      </div>
    </div>
  );
};

export default Message;
