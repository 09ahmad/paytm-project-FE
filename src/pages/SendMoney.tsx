import { useSearchParams } from "react-router-dom"
import axios from "axios";
import { useState } from "react";

export function SendMoney() {
  const [searchParams]=useSearchParams()
  const [amount,setAmount]=useState(0);
  console.log(searchParams)
  const id=searchParams.get("id");
  const name=searchParams.get("name")

function getToken(){
  const token = localStorage.getItem("token");
  console.log(token);
}
  return <div className="flex justify-center h-screen bg-gray-100">
    <div className="h-full flex flex-col justify-center">
      <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 shadow-lg rounded-lg ">
        <div className="flex flex-col space-y-1.5 p-6">
          <h2 className="text-3xl font-bold text-center">Send Money</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-2xl text-white">{name && name[0].toUpperCase()}</span>
            </div>
            <h3 className="text-2xl font-semibold">{name}</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2 font-semibold">
              Send money
              <input onChange={(e)=>{
                setAmount(parseInt(e.target.value))
              }} type="number" className="flex h-10 w-full rouned-md borded-input bg-background px-3 py-2 text-sm"
                id="amount" placeholder="Enter amount " />
            </div>
            <button className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
            onClick={async()=>{
              try{
                const response=await axios.post("http://localhost:8080/api/v1/account/transfer",{
                  to:id,
                  amount
                },{
                  headers:{
                    Authorization:"Bearer "+localStorage.getItem("token")
                  }
                })
              }catch(error){
                console.log("Transection failed",error)
              }
            }}
              >
              Initiate Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
}



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2NkNmViMTYzMmFhNjUyOGYxNTEzN2YiLCJpYXQiOjE3NDE1MTY0NjUsImV4cCI6MTc0MTUyMDA2NX0.T_5-HmuufB7KghSGS60UZISADhaCY7y6_zKTDboG-kA
