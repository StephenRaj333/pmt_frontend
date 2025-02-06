import { useEffect, useState } from "react";
import Axios from "axios";
import Card from "@/component/Card";
import Aside from "@/component/Aside";
import Header from '@/component/Header';
import LowRisk from "@/component/SvgIcons/Low";
import HalfDoughnutChart from '@/component/Chart';
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import MediumRisk from "@/component/SvgIcons/Medium";
import HighRisk from "@/component/SvgIcons/High";
import AllTask from "@/component/SvgIcons/AllTask";
import DownloadCSV from '@/component/Csv_Report'; 

const Dashboard = () => {
    const base_url = process.env.NEXT_PUBLIC_PMT_BACKEND_BASE_URL
    const Router = useRouter()
    const [displayTask, setDisplayTask] = useState<any>([]);
    const [fetchData, setFetchData] = useState<any>([]);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [showDropDown, setShowDropDown] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [priority, setPriority] = useState("medium");
    const [deadline, setDeadline] = useState<any>("");
    const [status, setStatus] = useState("progress");
    const [passId, setPassId] = useState("");
    const [refreshPage, setRefreshToken] = useState(false);   /// try to do without this state 
    const [activeLink, setActiveLink] = useState<boolean>(false);
    const [tabactiveLink, setTabActiveLink] = useState<boolean>(false);
    const [techStack, setTechStacks] = useState<any>([
        { id: 0, val: "html", checked: false },
        { id: 1, val: "css", checked: false },
        { id: 2, val: "javascript", checked: false },
        { id: 3, val: "reactjs", checked: false },
        { id: 4, val: "nodejs", checked: false }
    ]);
    const [teamLead, setTeamLead] = useState("");
    const [overdue, setOverdue] = useState([]);
    const [uniqueId, setUniqueId] = useState("");

    const [allTaskState, setAllTaskState] = useState(false);
    const [allTask, setAllTask] = useState([]);

    const [completedState, setCompletedState] = useState(false);
    const [completedTask, setCompletedTask] = useState([]);

    const [pendingState, setPendingState] = useState(false);
    const [pendingTask, setPendingTask] = useState([]);

    const [overdueState, setOverdueState] = useState(false);
    const [overdueTask, setOverdueTask] = useState([]);

    const [riskFactor, setRiskFactor] = useState([]);

    useEffect(() => {
        async function CallUserInfo() {
            try {
                const response = await Axios.get(`${base_url}/get/userInfo`, { headers: { "token": sessionStorage.getItem("token") } });
                setUserInfo(response.data);
                if (response.status == 200) {
                    setEditModal(false);
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
                const token: any = sessionStorage.getItem("token");
                const decoded: any = await jwtDecode(token);
                const response = await Axios.get(`${base_url}/get/matchUser`, { headers: { "findemail": decoded.email } });
                setFetchData(response.data);
                console.log(response.data);
                
            } catch (err) {
                console.log(err);
            }
        }
        MatchUser()
    }, [refreshPage])    /// when i select status and click on modal full data comes out  ! why?     


    useEffect(() => {
        async function FetchDynamic() {
            setDisplayTask(fetchData)
            setRiskFactor(fetchData);
            if (completedState) {
                setDisplayTask(completedTask);
                setRiskFactor(completedTask);
            }
            if (pendingState) {
                setDisplayTask(pendingTask);
                setRiskFactor(pendingTask);
            }
            if (allTaskState) {
                setDisplayTask(allTask);
                setRiskFactor(allTask);
            }
            if (overdueState) {
                setDisplayTask(overdueTask);
                setRiskFactor(overdueTask);
            }
        }

        FetchDynamic();
    }, [fetchData, completedState, pendingState, allTaskState, overdueState]);



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
                setEditModal(false);
                setRefreshToken(true);
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
        setEditModal(true);
        setRefreshToken(false);
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
        setEditModal(true);
        setRefreshToken(false);
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
                setEditModal(false);
                setRefreshToken(true); // Toggle the refreshPage state 
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

    const handleDelete = (idx: any) => {
        setUniqueId(idx);
        setDeleteModal(true)
        setRefreshToken(false);
    }

    const handleDeleteTask = async () => {
        try {
            const response = await Axios.post(`${base_url}/delete/task`, { userId: uniqueId });
            if (response.status == 200) {
                setRefreshToken(true);
                setDeleteModal(false);
            }
        } catch (err) {
            console.log(err);
        }
    }


    const handleLogOut = () => {
        sessionStorage.clear();
        Router.push("/login");
    }

    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const findOverDue = fetchData?.filter((item: any) => {
            const [incomingYear, incomingMonth, incomingDay] = item.deadline.split("-").map(Number);

            console.log("Incoming Day", incomingDay);
            console.log("Incoming Month", incomingMonth);
            console.log("Incoming Year", incomingYear);

            const itemDate = new Date(incomingYear, incomingMonth - 1, incomingDay);
            const today = new Date(currentYear, currentMonth - 1, currentDay);
            return itemDate <= today;
        });

        setOverdue(findOverDue);
    }, [fetchData])

    const handleAllTask = (idx: any) => {
        setActiveLink(idx);
        setEditModal(false);
        setAllTask(fetchData);
        setAllTaskState(true);
        setPendingState(false);
        setCompletedState(false);
        setOverdueState(false);
    }

    const handlePendingTask = (idx: any) => {
        setActiveLink(idx);
        setEditModal(false);
        const pendingTasks = fetchData.filter((item: any) => item.status == "progress");
        setPendingTask(pendingTasks);
        setPendingState(true);
        setCompletedState(false);
        setOverdueState(false);
        setAllTaskState(false);
    }

    const handleCompletedTask = (idx: any) => {
        setActiveLink(idx);
        setEditModal(false);
        const completedTasks = fetchData.filter((item: any) => item.status == "completed");
        setCompletedTask(completedTasks);
        setCompletedState(true);
        setAllTaskState(false)
        setPendingState(false);
        setOverdueState(false);
    }

    const handleOverDueTask = (idx: any) => {
        setActiveLink(idx);
        setEditModal(false);

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        const findOverDue = fetchData?.filter((item: any) => {
            const [incomingYear, incomingMonth, incomingDay] = item.deadline.split("-").map(Number);
            const itemDate = new Date(incomingYear, incomingMonth - 1, incomingDay);
            const today = new Date(currentYear, currentMonth - 1, currentDay);
            return itemDate <= today;
        });

        setOverdue(findOverDue);
        setOverdueTask(findOverDue);
        setOverdueState(true);
        setPendingState(false);
        setCompletedState(false);
        setAllTaskState(false);
    }

    const menuItems = [
        {
            id: 0,
            title: "All Tasks",
            icon: (
                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-[#000]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
            ),
            active: activeLink,
            statusText: fetchData.length,
            menuItemClick: (idx: any) => handleAllTask(idx),
        },
        {
            id: 1,
            title: "Completed",
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-[#000]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
            ),
            active: activeLink,
            statusText: fetchData?.filter((item: any) => item?.status == "completed")?.length,
            menuItemClick: (idx: any) => handleCompletedTask(idx),
        },
        {
            id: 2,
            title: "Pending",
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-[#000]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
            ),
            active: activeLink,
            statusText: fetchData?.filter((item: any) => item?.status == "progress")?.length,
            menuItemClick: (idx: any) => handlePendingTask(idx),
        },
        {
            id: 3,
            title: "Overdue",
            icon: (
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-[#000]" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
            ),
            active: activeLink,
            statusText: overdue.length,
            menuItemClick: (idx: any) => handleOverDueTask(idx),
        }
    ];


    const dataOptions: any = {
        labels: ["Completed", "Pending"],
        datasets: [
            {
                data: [fetchData.filter((item: any) => item.status == "completed").length, fetchData.filter((item: any) => item.status == "progress").length],
                backgroundColor: ["#8bce8a", "#eb4f31"],
                hoverBackgroundColor: ["#45a049", "#f57c00"],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%", // Adjust thickness
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#FFF", // Change label color (e.g., red)
                    font: {
                        size: 14, // Adjust font size
                        weight: "bold", // Make it bold
                    },
                },
            },
        },
    };

    const tabs: any = [
        {
            id: 0,
            Title: "All",
            Icon: <AllTask />,
            active: tabactiveLink,
            RiskItemClick: (idx: number) => AllRisk(idx),
        },
        {
            id: 1,
            Title: "Low",
            Icon: <LowRisk />,
            active: tabactiveLink,
            RiskItemClick: (idx: number) => LowRisks(idx),
        },
        {
            id: 2,
            Title: "Medium",
            Icon: <MediumRisk />,
            active: tabactiveLink,
            RiskItemClick: (idx: number) => MediumRisks(idx),
        },
        {
            id: 3,
            Title: "High",
            Icon: <HighRisk />,
            active: tabactiveLink,
            RiskItemClick: (idx: number) => HighRisks(idx),
        }
    ]

    const AllRisk = (idx: any) => {
        setTabActiveLink(idx);
        const AllTaskRate = riskFactor.map((item: any) => {
            if (item.priority) return item;
            else return null;
        }).filter((item: any) => item !== null);
        setDisplayTask(AllTaskRate);
    }

    const LowRisks = (idx: any) => {
        setTabActiveLink(idx);
        const LowTaskRate = riskFactor.map((item: any) => {
            if (item.priority === "low") return item;
            else return null;
        }).filter((item: any) => item !== null);
        setDisplayTask(LowTaskRate);

    }

    const MediumRisks = (idx: any) => {
        setTabActiveLink(idx);
        const MediumTaskRate = riskFactor.map((item: any) => {
            if (item.priority === "medium") return item;
            else return null;
        }).filter((item: any) => item !== null);
        setDisplayTask(MediumTaskRate);
    }

    const HighRisks = (idx: any) => {
        setTabActiveLink(idx);
        const HighTaskRate = riskFactor.map((item: any) => {
            if (item.priority === "high") return item;
            else return null;
        }).filter((item: any) => item !== null);
        setDisplayTask(HighTaskRate);
    }

    const handleDownloadClick = () => {
        console.log("Download Click from  parent Click !");     
    }

    return (
        <>
            <Header pendingTasks={fetchData?.filter((item: any) => item?.status == "progress")?.length} handleLogOut={handleLogOut} name={userInfo?.name} email={userInfo?.email} showDropDown={showDropDown} handleDropDown={() => setShowDropDown(!showDropDown)} />

            <Aside menuItems={menuItems} activeState={activeLink} />

            <div className="wrapper relative main-content-wrapper" onClick={() => setShowDropDown(false)}>
                <div className="status-tabs">
                    <div className="content">
                        <div className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="left-sec">
                                <ul className="flex flex-wrap justify-start -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                    {tabs?.map((item: any, index: number) => {
                                        return (
                                            <li key={index} onClick={() => item.RiskItemClick(index)} className="me-2">
                                                <span className={`inline-flex ${item.active == index ? "active" : "inactive"} items-center justify-center p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500 group`}>
                                                    {item.Icon} {item.Title}
                                                </span>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="right-sec">         
                                <div className="download-report">       
                                    <DownloadCSV fileName={userInfo?.name} data={fetchData} onClick={handleDownloadClick} />
                                </div>      
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stats">
                    <div className="stats-content">
                        <div className="block-1">
                            <div className="img-wrapper">
                                <div className="span">
                                    <p>{userInfo?.name?.split("").join().at(0)} </p>
                                </div>
                            </div>
                            <div className="info">
                                <h3>Hello,</h3>
                                <h5>Stephen</h5>
                            </div>
                        </div>
                        <div className="block-2">
                            <div className="content">
                                <div className="left-sec">
                                    <div className="blocks">
                                        <h4>Total Tasks:</h4>
                                        <p className="one">{fetchData.length}</p>
                                    </div>
                                    <div className="blocks">
                                        <h4>In Progress:</h4>
                                        <p className="two">{fetchData?.filter((item: any) => item?.status == "progress").length}</p>
                                    </div>
                                </div>
                                <div className="right-sec">
                                    <div className="blocks">
                                        <h4>Completed:</h4>
                                        <p className="two">{fetchData?.filter((item: any) => item?.status == "completed").length}</p>
                                    </div>
                                    <div className="blocks">
                                        <h4>Open Tasks:</h4>
                                        <p className="one">{overdue.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block-3">
                            <div className="bar-chart">
                                <HalfDoughnutChart dataOption={dataOptions} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-left gap-[30px] card-wrappers">
                    {displayTask?.map((item: any, index: number) => {
                        return (
                            <Card key={index} editClick={() => handleEdit(item)} deleteClick={() => handleDelete(item._id)} title={item.taskName} desc={item.taskDesc} date={item.deadline} priority={item.priority} />
                        )
                    })}

                    <button onClick={handleAddTask} className="add-button rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400  hover:bg-lightgray-600 active:bg-violet-700 transition duration-200 ease-in-out">Add New Task</button>
                </div>
                {/* Edit Modal */}

                <div id="crud-modal" className={` ${editModal ? "block" : "hidden"} modal-wrapper`}>
                    <div className="relative p-4 w-full max-w-md max-h-full inner">
                        <div className="relative bg-white rounded-lg shadow-sm sub-inner">
                            <div className="header flex items-center justify-between border-b rounded-t dark:border-gray-600 border-gray-200 pb-[10px]">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {passId !== "" && refreshPage ? "Update Your Task" : "Create New Task"}
                                </h3>
                                <button type="button" onClick={() => setEditModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
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
                            {passId !== "" && editModal ?
                                <>
                                    <button onClick={handleUpdate} className="btn ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Update Now !
                                    </button>
                                </>
                                :
                                <>
                                    <button onClick={handleClick} className="btn ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                        Add new product
                                    </button>
                                </>}

                        </div>
                    </div>
                </div>

                {/* Edit Modal */}

                {/* Delete Modal */}
                <div id="crud-modal" className={` ${deleteModal ? "block" : "hidden"} delete modal-wrapper`}>
                    <div className="relative p-4 w-full max-w-md max-h-full inner">
                        <div className="relative bg-white rounded-lg shadow-sm sub-inner">
                            <div className="header flex items-center justify-between border-b rounded-t dark:border-gray-600 border-gray-200 pb-[10px]">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Delete this Task
                                </h3>
                                <button type="button" onClick={() => setDeleteModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="wrapper">
                                <div className="delete-content">
                                    <h3>Are you Sure you want to Delete this Task ?</h3>
                                </div>
                                <div className="btn-wrapper">
                                    <button onClick={() => setDeleteModal(false)} className="btn ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteTask} className="btn ml-5 mb-5 text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Delete !
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Delete Modal */}

            </div>
        </>
    )
}

export default Dashboard;       