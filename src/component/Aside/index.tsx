

const Aside = ({ menuItems }: any) => { 
    return (
        <>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto h-full">
                    <ul className="space-y-2 font-medium">
                        {menuItems?.map((item: any, index: number) => {
                            return (
                                <li key={index} onClick={() => item.menuItemClick(index)}>  
                                    <a className={item.active  == item.id ? "active": ""}>  
                                        <div className="f-block"> {item.icon}
                                            <span className="ms-3 flex-1">{item.title}</span>
                                        </div>
                                        <div className="l-block">{item.statusText}</div>
                                    </a>
                                </li>
                            )   
                        })}
                    </ul>
                </div>
            </aside>
        </>
    )
}

export default Aside;