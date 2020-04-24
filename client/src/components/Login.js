import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialState = {
  username: "",
  password: "",
  isFetching: false
}

const Login = props => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [login, setLogin] = useState(initialState);

  const handleChange = event => {
    setLogin({ ...login, [event.target.name]: event.target.value });
    console.log(login);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setLogin({ ...login, isFetching: true });
    axiosWithAuth()
      .post("http://localhost:5000/api/login", login)
      .then(response => {
        console.log("axios post response: ", response)
        localStorage.setItem("token", response.data.payload);
        props.history.push("/bubble-page");
      })
      .catch(error => {
        console.log("error from post request", error);
      })
  }

  return (
    <>
      <h1>Welcome to the Bubble App!</h1>
      <form onSubmit={handleSubmit}>
        <input
          label="Username"
          type="text"
          name="username"
          placeholder="username"
          value={login.username}
          onChange={handleChange}
        />
        <br />
        <input
          label="Password"
          type="text"
          name="password"
          placeholder="password"
          value={login.password}
          onChange={handleChange}
        />
        <br/>
        <br/>
        <button>Log In</button>
        {login.isFetching && "Please wait, loggin in..."}
      </form>
    </>
  );
};

export default Login;
