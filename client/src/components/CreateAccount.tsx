import React, { useState } from "react";
import UserFinder from "../apis/UserFinder";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice";

const CreateAccount = () => {
  //Defines state values for the component
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //Used for user log in
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    //Prevents page refresh on function trigger
    e.preventDefault();

    //Sets the loading state to be true so that we can render a loading screen whilst the user is logged in
    setLoading(true);

    //UserFinder is the base url for the api
    try {
      //Makes a call to the db to get all users  with the entered username
      const response = await UserFinder.get(`/${username}`);
      //Checks ti see if this username is already in the database
      if (response.data.data.users.length === 0) {
        //Checks to see if the passwords match and if a username was provided
        if (password === passwordCheck && username && password) {
          //Creates the user
          try {
            const response = await UserFinder.post("/createUser", {
              username,
              password,
            });

            //Logs the user in
            dispatch(
              logIn({
                username,
                password,
              })
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          setLoading(false);
          //Returns an alert message based on if a password was provided
          alert(
            password
              ? "Passwords do not match"
              : "Please eneter a username and password to register."
          );
        }
      } else {
        setLoading(false);
        alert("That username is already in use, please select another.");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500">
          Loading...
        </div>
      ) : (
        <div className="bg-gray-100 w-full h-screen">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-5xl text-orange-500 text-center">Sign up</h1>
            <p className="text-sm text-orange-500 text-center mt-4">
              Please enter a username and password to get started:
            </p>
            <form className="mt-2 p-2">
              <label className="block">Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 border-orange-500 rounded w-full pl-1"
                name="username"
                type="text"
              ></input>
              <label className="block">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="border-2 border-orange-500 rounded w-full pl-1"
                name="password"
                type="password"
              ></input>
              <label className="block">Re-Type Password</label>
              <input
                onChange={(e) => setPasswordCheck(e.target.value)}
                className="border-2 border-orange-500 rounded w-full pl-1"
                name="passwordCheck"
                type="password"
              ></input>
            </form>
            <button
              onClick={handleSubmit}
              type="submit"
              className="flex m-auto pl-2 pr-2 p-1 text-xl mb-2 rounded text-white bg-orange-500 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAccount;
