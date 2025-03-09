import { useState } from "react";
import ButtonWarning from "../components/BottomWarning";
import Button from "../components/Button";
import Heading from "../components/Heading";
import InputBox from "../components/InputBox";
import SubHeading from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Signup() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  return <div className="bg-slate-300 h-screen  flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-96 text-center p-2 h-max  px-4">
        <Heading label={"Signup"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox label={"First Name"} placeholder={"John"} onChange={(e) => {
          setFirstName(e.target.value)
        }} />
        <InputBox label={"Last Name"} placeholder={"Wick"} onChange={(e) => {
          setLastName(e.target.value)
        }} />
        <InputBox label={"Email"} placeholder={"example@gmail.com"} onChange={(e) => {
          setUsername(e.target.value)
        }} />
        <InputBox label={"password"} placeholder={"set password"} onChange={e => {
          setPassword(e.target.value)
        }} />
        <div className="pt-4">
          <Button label={"Sign up"} onClick={async () => {
            try {
              const response = await axios.post("http://localhost:8080/api/v1/user/signup", {
                firstName,
                lastName,
                username,
                password
              })
              if (!response.data.token) {
                console.log("Authentication failder bcz token not found")
                return;
              }
              localStorage.setItem("token", response.data.token)
            } catch (error) {
              console.error("Error while Sign up")
            }
            navigate("/dashboard")
          }} />
        </div>
        <ButtonWarning label={"Already have an account?"} buttonText={"Sign in "} to={"/signin"} />
      </div>
    </div >
  </div>
}
