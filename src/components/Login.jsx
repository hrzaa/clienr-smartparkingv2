import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          username,
          password,
        }
      );
      const { data } = response.data;

      const isSecure = window.location.protocol === "http:";

      Cookies.set("userId", data.userId, { secure: isSecure });
      Cookies.set("token", data.token, { secure: isSecure });
      Cookies.set("role", data.role, { secure: isSecure });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
    }
  }

   return (
     <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
       <div className="sm:mx-auto sm:w-full sm:max-w-sm">
         <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
           Smart Parking System
         </h2>
       </div>
       <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
         <form className="space-y-6" onSubmit={handleLogin}>
           <div>
             <label
               htmlFor="username"
               className="block text-sm font-medium leading-6 text-gray-900"
             >
               Username
             </label>
             <div className="mt-2">
               <input
                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 id="username"
                 type="text"
                 placeholder="Username"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 required
               />
             </div>
           </div>

           <div>
             <div className="flex items-center justify-between">
               <label
                 htmlFor="password"
                 className="block text-sm font-medium leading-6 text-gray-900"
               >
                 Password
               </label>
             </div>
             <div className="mt-2">
               <input
                 id="password"
                 type="password"
                 placeholder="Password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               />
             </div>
           </div>

           <div>
             <button
               type="submit"
               className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             >
               Sign in
             </button>
           </div>
         </form>
       </div>
     </div>
   );

};



export default Login;