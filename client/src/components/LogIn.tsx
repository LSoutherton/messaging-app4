import React, { useState } from "react";
import { Link } from "react-router-dom";
import UserFinder from "../apis/UserFinder";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice";

type Props = {
  example: boolean;
};

const LogIn: React.FC<Props> = ({ example }) => {
  const [username, setUsername] = useState<string>(example ? "Example" : "");
  const [password, setPassword] = useState<string>(
    example ? "examplePassword1" : ""
  );

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleLogIn = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (username && password) {
      try {
        const response = await UserFinder.get(`/${username}`);
        if (
          response.data.data.users.length === 1 &&
          username === response.data.data.users[0].username &&
          password === response.data.data.users[0].password
        ) {
          dispatch(
            logIn({
              username,
              password,
            })
          );
          if (username === "Example") {
            const response = await UserFinder.delete(`/delete/example`);
            setTimeout(async () => {
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

              const response = await UserFinder.post("/sendMessage", {
                sender: "Bot",
                receiver: "Example",
                message:
                  "Hello, welcome to my messaging app! Please feel free to play around, your messages will all be deleted when your session is ended. Please note that this bot will not be able to respond to any messages.",
                date: dateString,
                date_calc: today,
                time: currentTime,
                time_num,
              });
            }, 2000);
          }
        } else {
          setLoading(false);
          alert("Username and password do not match.");
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else {
      setLoading(false);
      alert("Please enter a username and password.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 text-center">
          Trying to sign you in, this can take up to a minute...
        </div>
      ) : (
        <div className="bg-gray-100 w-full h-screen">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-5xl text-orange-500">MessagingApp</h1>
            <form onSubmit={handleLogIn} className="mt-2 p-2">
              <label className="block">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-orange-500 rounded w-full pl-1"
                name="username"
                type="text"
              ></input>
              <label className="block">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-orange-500 rounded w-full pl-1"
                name="password"
                type="password"
              ></input>
              <button
                onClick={handleLogIn}
                type="submit"
                className="flex m-auto mt-2 pl-2 pr-2 p-1 text-xl mb-2 rounded text-white bg-orange-500 cursor-pointer"
              >
                Log In
              </button>
            </form>
            <p className="text-sm text-center">
              Not registered yet? Click{" "}
              <Link
                className="text-blue-500 underline font-bold cursor-pointer"
                to="/create"
              >
                here
              </Link>{" "}
              to create an account.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LogIn;
