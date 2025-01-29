import { useEffect, useState } from "react";
import Axios from "axios";
import Card from "@/component/Card";
import Aside from "@/component/Aside";
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

            <Aside />   

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