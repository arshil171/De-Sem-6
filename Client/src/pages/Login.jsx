import React, { useState } from 'react'
import loginImage from '../assets/images/image.png';
import { Link, useNavigate } from 'react-router';
import axios from "axios";

const Login = () => {
   const [data, setData] = useState({ Email: "", Password: "", Name: "" });
    const [submitData, setSubmitData] = useState(null);
    const [error, setError] = useState({});

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();
        if (validation()) {
            try {
                 const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                        name: data.Name,
                        email: data.Email,
                        password: data.Password
                    },
                    { withCredentials: true }
                );

                localStorage.setItem("token", res.data.token);
                alert(res.data.message);

                setSubmitData(data);
                setData({ Email: "", Password: "", Name: "" });

                navigate('/home')

            } catch (err) {
                alert(err.response?.data?.message || "Login Failed");
            }
        }
    }

    function validation() {
        let obj = {};
        let value = true;

        if(!data.Name.trim()){
          value = false
          obj.name = "Enter a valid Name"
        }

        if (!data.Email.trim()) {
            value = false;
            obj.email = "Enter a valid Email";
        }
        if (!data.Password.trim()) {
            value = false;
            obj.password = "Enter a valid Password";
        } 
        setError(obj);
        return value;
    }

  return (
    <div className="w-full h-screen flex justify-start items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${loginImage})` }}
        >
            <div className="w-[450px] bg-white/30 backdrop-blur-md rounded-xl shadow-lg shadow-gray-400 border p-8 ml-20">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                  {/* Name */}
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600 w-6 h-6"> <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.54 5.698a3 3 0 01-2.92 0L1.5 8.67z" /> <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 6.476a1.5 1.5 0 001.572 0L22.5 6.908z" /> </svg>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            value={data.Name}
                            onChange={(e) => setData({ ...data, Name: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 border rounded-lg border-black-400 focus:ring-2 focus:ring-amber-400 outline-none transition"
                        />
                    </div>
                    {error.name && <p className="text-red-600 text-sm">{error.name}</p>}

                    {/* Email */}
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600 w-6 h-6"> <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.54 5.698a3 3 0 01-2.92 0L1.5 8.67z" /> <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 6.476a1.5 1.5 0 001.572 0L22.5 6.908z" /> </svg>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={data.Email}
                            onChange={(e) => setData({ ...data, Email: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 border rounded-lg border-black-400 focus:ring-2 focus:ring-amber-400 outline-none transition"
                        />
                    </div>
                    {error.email && <p className="text-red-600 text-sm">{error.email}</p>}

                    {/* Password */}
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600 w-6 h-6"> <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /> </svg>
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            value={data.Password}
                            onChange={(e) => setData({ ...data, Password: e.target.value })}
                            className="w-full pl-10 pr-3 py-3 border rounded-lg border focus:ring-2 focus:ring-amber-400 outline-none transition"
                        />
                    </div>
                    {error.password && <p className="text-red-600 text-sm">{error.password}</p>}

                    <div className="flex justify-between items-center text-black text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="accent-amber-600" /> Remember me
                        </label>
                        <a href="#" className="hover:text-amber-500 transition">Forgot Password?</a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full py-3 cursor-pointer bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition"
                    >
                        Login
                    </button>

                    {/* Social Login */}
                    <div className="flex flex-col gap-3 mt-4"> <button className="flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-pointer transition"> <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48" className="w-5 h-5"> <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.628,43.864,21.357,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.336,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.002,0.003-0.003l6.19,5.238C36.971,39.205,44,34,44,24C44,22.628,43.864,21.357,43.611,20.083z"></path> </svg> Sign in with Google </button> </div>

                    <div className="flex flex-col items-center gap-2 mt-4 text-sm text-gray-700">
                        <a href="#" className=" text-black transition">Help With Login</a>
                        <div className='text-black'>
                            Don't have an account? <Link to={"/register"} className='text-cyan-300 cursor-pointer hover:text-cyan-400'>
                            Sign Up</Link>
                        </div>
                    </div>
                </form>

                {submitData && (
                    <div className="mt-6 bg-white/70 rounded-lg p-4 shadow-md text-gray-800">
                        <p>Name: {submitData.Name}</p> 
                        <p>Email: {submitData.Email}</p>
                        <p>Password: {submitData.Password}</p>
                    </div>
                )}
            </div>
        </div>
  )
}

export default Login