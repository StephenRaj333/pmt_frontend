import Link from 'next/link';
import Axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from 'react';
import { useRouter } from 'next/router';

const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const base_url = process.env.NEXT_PUBLIC_PMT_BACKEND_BASE_URL
    const Router = useRouter()

    const submitLogin = async () => {
        const formData = {
            email: email,
            password: password
        }
        try {
            const response = await Axios.post(`${base_url}/post/login`,formData,{headers:{"Content-Type": "application/json"}});
            if(response?.status == 200 && response?.data?.token) { 
                sessionStorage.setItem("token",response?.data?.token);
                toast.success("Login Successfull", {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                }) 
                setTimeout(() => Router.push('/dashboard'),3000);
            } 
        } catch(err:any) {
            console.log(err);
            if(err?.response?.data?.name == "ValidationError") {    
                toast.error(err?.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });     
            } else if(err?.response?.data == "Credentials Dont Match") {
                toast.error(err?.response?.data, {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                }); 
            }
             else {
                toast.error(err?.response?.data?.errorResponse, {
                    position: "top-right",
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
            }
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900 logins-screen">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 logins-screen-inner">
                <Link href="/" className="gold-color flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-20 h-20" src="https://gild.cards/4c9f83615917fc1801dc.png" alt="logo" />   
                    Login
                </Link>
                <div className="login-container w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 inner-container"> 
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Login to Dashboard
                        </h1>
                        <div className='form-group'>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" className="text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="••••••••" className="text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>  
                        <button type="button" onClick={submitLogin} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Do not Have an account? <Link href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Signup here</Link>
                        </p>
                    </div>  
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />      
        </section>
    )
}

export default Login;