import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      Cookies.set("username", data.username, { secure: isSecure });
      Cookies.set("token", data.token, { secure: isSecure });
      Cookies.set("role", data.role, { secure: isSecure });

      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.errors
          ? error.response.data.errors
          : error.message;
      // alert(`Registration error: ${errorMessage}`);
      setError(errorMessage);
      // console.error("Registration error:", errorMessage);

      // console.error("Login error:", error.response ? error.response.data : error.message);
    }
  }

   return (
     <section class="bg-gray-50">
       <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
         <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
           <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
             <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
               Smart Parking System
             </h1>

             <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
               {error && (
                 <div
                   class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                   role="alert"
                 >
                   <p class="font-bold">{error}</p>
                 </div>
               )}
               <div>
                 <label
                   htmlFor="username"
                   className="block mb-2 text-sm font-medium text-gray-900 "
                 >
                   Username
                 </label>
                 <input
                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                   id="username"
                   type="text"
                   placeholder="Username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   required
                 />
               </div>

               <div>
                 <label
                   htmlFor="password"
                   className="block mb-2 text-sm font-medium text-gray-900"
                 >
                   Password
                 </label>
                 <input
                   id="password"
                   type="password"
                   placeholder="Password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                 />
               </div>
               <button
                 type="submit"
                 class="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
               >
                 Sign in
               </button>
               <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                 Don’t have an account yet?{" "}
                 <Link
                   to="/register"
                   className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                 >
                   Sign Up
                 </Link>
                 {/* <a
                   href="#"
                   class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                 >
                   Sign up
                 </a> */}
               </p>

               {/* <div>
                 <button
                   type="submit"
                   className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                 >
                   Sign in
                 </button>
               </div> */}
             </form>
           </div>
         </div>
       </div>
     </section>
   );

};



export default Login;