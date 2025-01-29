import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Axios from 'axios';

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const base_url = process.env.NEXT_PUBLIC_PMT_BACKEND_BASE_URL

    const router = useRouter();

    const handleClick = async () => {
        const formData = {
            name: name,
            email: email,
            password: password
        }
        try {
            const response = await Axios.post(`${base_url}/post/signup`, formData, { headers: { "Content-Type": "application/json" } });
            if (response.status == 200) {
                router.push("/login");
            } else {
                throw new Error
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    Signup
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Create an account
                        </h1>
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="stephen " />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <button type="button" onClick={handleClick} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Submit</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Signup;