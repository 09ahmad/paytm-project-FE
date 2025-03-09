import axios from "axios"
import Button from "./Button"
import { use, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
interface UserProp {
    firstName: string,
    lastName: string,
    _id:string
}

export default function Users() {
    const [users, setUsers] = useState<UserProp[]>([]);
    const [filter,setFilter]=useState<string>("")
    useEffect(() => {
        const getData=setTimeout(()=>{
            axios.get("http://localhost:8080/api/v1/user/bulk?filter="+filter)
            .then(response => {
                console.log(response.data.user)
                setUsers(response.data.user)
            }).catch((error) => { console.error("Error fetching the users:", error) })
        },1000)
         return ()=> clearTimeout(getData)
    }, [filter])

    return <>
        <div className="font-bold mt-6 text-lg">User</div>
        <div className="my-2">
            <input type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"
            onChange={(e)=>{
                setFilter(e.target.value)
            }}
             />
        </div>
        <div>
            {users.map((user) => <User _id={user._id} firstName={user.firstName} lastName={user.lastName} />)}
        </div>
    </>
}


function User({ firstName, lastName ,_id }: UserProp ,) {
    const navigate=useNavigate()
    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2" >
                <div className="flex flex-col justify-center h-full text-xl">
                    {firstName.charAt(0)}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full ">
                <div>
                    {firstName} {lastName}
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-center h-full">
            <Button label={"Send Money"} onClick={()=>{
                navigate("/send?id="+_id+"&name="+firstName)
            }}/>
        </div>
    </div>
}
