import { useEffect, useState } from "react";
import Axios from "axios";
import Card from "@/component/Card";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

const Dashboard = () => {
    const base_url = process.env.NEXT_PUBLIC_PMT_BACKEND_BASE_URL
    const Router = useRouter()

    const [fetchData, setFetchData] = useState<any>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [modal, setModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [priority, setPriority] = useState("medium");
    const [deadline, setDeadline] = useState<any>("");
    const [status, setStatus] = useState("progress");
    const [passId, setPassId] = useState("");
    const [refreshPage,setRefreshToken] = useState(false);   /// try to do without this state 
    const [techStack, setTechStacks] = useState<any>([
        { id: 0, val: "html", checked: false },
        { id: 1, val: "css", checked: false },
        { id: 2, val: "javascript", checked: false },
        { id: 3, val: "reactjs", checked: false },
        { id: 4, val: "nodejs", checked: false }
    ]);   
    const [teamLead, setTeamLead] = useState("");

    useEffect(() => {
        async function CallUserInfo() {
            try {
                const response = await Axios.get(`${base_url}/get/userInfo`, { headers: { "token": sessionStorage.getItem("token") } });
                setUserInfo(response.data);
                if (response.status == 200) {
                    setModal(false);
                    setRefreshToken(false)
                }
            } catch (err: any) {
                if (err.status == 401) {
                    Router.push("/login");
                }
                console.log(err);
            }
        }
        CallUserInfo()
    }, [])

    const handledisplayChange = (e: any, index: number) => {
        const newData = techStack?.map((item: any) => {
            if (item.id == index) {
                return { ...item, checked: e.target.checked ? true : false }
            } else {
                return item
            }
        })
        setTechStacks(newData);
    }

    const techStacks = techStack?.filter((item: any) => item.checked == true).map((item: any) => item.val);

    useEffect(() => {
        async function MatchUser() {
            try {
                if (fetchData) {
                    const token: any = sessionStorage.getItem("token");
                    const decoded: any = await jwtDecode(token);
                    const response = await Axios.get(`${base_url}/get/matchUser`, { headers: { "findemail": decoded.email } });
                    setFetchData(response.data);
                }
            } catch (err) {
                console.log(err);
            }
        }
        MatchUser()
    }, [modal,refreshPage])

    const handleClick = async () => {
        const token: any = sessionStorage.getItem("token");
        const decoded: any = await jwtDecode(token);

        const formData = {
            userName: decoded.name,
            userEmail: decoded.email,
            taskName: taskName,
            taskDesc: taskDesc,
            priority: priority,
            deadline: deadline,
            status: status,
            techStacks: techStacks,
            teamLead: teamLead
        }
        try {
            const response = await Axios.post(`${base_url}/post/taskDetails`, formData, { headers: { "Content-Type": "application/json" } });
            console.log(response.data);
            if (response.status == 200) {
                setModal(false);
                setRefreshToken(false)
                setTaskName("");
                setTaskDesc("");
                setPriority("medium");
                setStatus("progress");
                setTechStacks([
                    { id: 0, val: "html", checked: false },
                    { id: 1, val: "css", checked: false },
                    { id: 2, val: "javascript", checked: false },
                    { id: 3, val: "reactjs", checked: false },
                    { id: 4, val: "nodejs", checked: false }
                ])
                setDeadline(new Date())
                setTeamLead("");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleAddTask = () => {
        setModal(true)
        setRefreshToken(true);
        setPassId("");
        setTaskName("");    
        setTaskDesc("");    
        setPriority("medium");  
        setStatus("progress");  
        setTechStacks([
            { id: 0, val: "html", checked: false },
            { id: 1, val: "css", checked: false },
            { id: 2, val: "javascript", checked: false },
            { id: 3, val: "reactjs", checked: false },
            { id: 4, val: "nodejs", checked: false }
        ])  
        setDeadline(new Date()) 
        setTeamLead("");    
    }

    const handleEdit = (itemIDx: any) => {
        setPassId(itemIDx._id);
        setModal(true);
        setRefreshToken(true);
        setTaskName(itemIDx.taskName);
        setTaskDesc(itemIDx.taskDesc);
        setPriority(itemIDx.priority);
        setDeadline(itemIDx.deadline);
        setStatus(itemIDx.status);
        setTechStacks([
            { id: 0, val: "html", checked: itemIDx?.techStacks.includes("html") },
            { id: 1, val: "css", checked: itemIDx?.techStacks.includes("css") },
            { id: 2, val: "javascript", checked: itemIDx?.techStacks.includes("javascript") },
            { id: 3, val: "reactjs", checked: itemIDx?.techStacks.includes("reactjs") },
            { id: 4, val: "nodejs", checked: itemIDx?.techStacks.includes("nodejs") }
        ]);
        setTeamLead(itemIDx.teamLead);   
    };

    const handleUpdate = async () => {
        const token: any = sessionStorage.getItem("token");
        const decoded: any = await jwtDecode(token);

        const formData = {
            userId: passId,
            userName: decoded.name,
            userEmail: decoded.email,
            taskName: taskName,
            taskDesc: taskDesc,
            priority: priority,
            deadline: deadline,
            status: status,
            techStacks: techStacks,
            teamLead: teamLead
        }
        try {
            const response = await Axios.post(`${base_url}/update/task`, formData, { headers: { "Content-Type": "application/json" } });
            console.log(response.data);
            if (response.status == 200) {
                setModal(false);  
                setRefreshToken(false);
                setTaskName("");    
                setTaskDesc("");    
                setPriority("medium");  
                setStatus("progress");  
                setTechStacks([
                    { id: 0, val: "html", checked: false },
                    { id: 1, val: "css", checked: false },
                    { id: 2, val: "javascript", checked: false },
                    { id: 3, val: "reactjs", checked: false },
                    { id: 4, val: "nodejs", checked: false }
                ])  
                setDeadline(new Date()) 
                setTeamLead("");    
            }   
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (idx:any) => {    
        try {
            const response = await Axios.post(`${base_url}/delete/task`,{userId: idx}); 
            if(response.status == 200) {      
                setRefreshToken(true);
            }   
        } catch (err) {     
            console.log(err);       
        }
    }


    const handleLogOut = () => {
        sessionStorage.clear();
        Router.push("/login");
    }

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <a className="flex ms-2 md:me-24">
                                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Hi {userInfo?.name} !</span>
                            </a>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3 relative">
                                <div>
                                    <button type="button" onClick={() => setShowDropDown(!showDropDown)} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>
                                        <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                                    </button>
                                </div>
                                <div className={`z-50 ${showDropDown ? "block" : "hidden"} absolute top-[20px] right-[-6px] my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user`}>
                                    <div className="px-4 py-3" role="none">
                                        <p className="text-sm text-gray-900 dark:text-white" role="none">
                                            {userInfo?.name}
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                            {userInfo?.email}
                                        </p>
                                    </div>
                                    <ul className="py-1" role="none">
                                        <li onClick={handleLogOut}>
                                            <span className=" cursor-pointer block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                    <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Up</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64 mt-[56px] wrapper relative" onClick={() => setShowDropDown(false)}>
                <div className="flex flex-wrap justify-left gap-[30px]">
                    {fetchData.map((item: any, index: number) => {
                        return (
                            <Card key={index} editClick={() => handleEdit(item)} deleteClick={() => handleDelete(item._id)} title={item.taskName} desc={item.taskDesc} date={item.deadline} priority={item.priority} />
                        )
                    })} 

                    <button onClick={handleAddTask} className="add-button h-[16rem] w-[313px] py-2 rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400  hover:bg-lightgray-600 active:bg-violet-700 transition duration-200 ease-in-out">Add New Task</button>
                </div>  
                {/* Modal */}

                <div id="crud-modal" className={` ${modal ? "block" : "hidden"} modal-wrapper`}>
                    <div className="relative p-4 w-full max-w-md max-h-full inner">
                        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700 sub-inner">
                            <div className="header flex items-center justify-between border-b rounded-t dark:border-gray-600 border-gray-200 pb-[10px]">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {passId !== "" && modal ? "Update Your Task" : "Create New Task"}
                                </h3>
                                <button type="button" onClick={() => setModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="grid gap-4 mb-4 grid-cols-2 body-content">
                                <div className="col-span-2 pt-2">
                                    <label htmlFor="taskname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Name</label>
                                    <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} name="taskname" id="taskname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" />
                                </div>
                                <div className="col-span-2 pt-2">
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Description</label>
                                    <textarea id="description" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your task description"></textarea>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Priority</label>
                                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option value="low">low</option>
                                        <option value="medium">medium</option>
                                        <option value="high">high</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date:</label>
                                    <div id="date-range-picker" className="flex items-center w-full">
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none w-full">
                                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                                </svg>
                                            </div>
                                            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} name="start" type="date" className="w-[100%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                        <option value="progress">Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="techStacks" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tech Stack</label>
                                    <div className="flex flex-wrap gap-[10px]">
                                        {techStack?.map((item: any, index: number) => {
                                            return (
                                                <div className="flex items-center me-4" key={index}>
                                                    <input name="html" type="checkbox" checked={item.checked} value={item.html} onChange={(e) => handledisplayChange(e, index)} className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="red-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{item.val}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="lead" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Team Leader</label>
                                    <input type="text" name="lead" value={teamLead} onChange={(e) => setTeamLead(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Enter your lead name" />
                                </div>
                            </div>
                            {passId !== "" && modal ?
                                <>
                                    <button onClick={handleUpdate} className="ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Update Now !
                                    </button>
                                </>
                                :
                                <>
                                    <button onClick={handleClick} className="ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                        Add new product
                                    </button>
                                </>}

                        </div>
                    </div>
                </div>

                {/* Modal */}
            </div>
        </>
    )
}

export default Dashboard;   