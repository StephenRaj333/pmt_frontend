

const Card = ({title,desc,date,priority,editClick,deleteClick}:any) => { 
    return (
        <div className="card-wrapper">
            <div className="inner">
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="content">   
                    <div className="left-sec">
                        <p>{date}</p>   
                    </div>
                    <div className="middle-sec">
                        <p>{priority}</p>   
                    </div>
                    <div className="right-sec flex">
                        <div className="img-wrapper" onClick={editClick}>
                            <img src="https://img.icons8.com/?size=100&id=MsQIVqWh2kj2&format=png&color=000000" alt="edit icons" />
                        </div>
                        <div className="img-wrapper" onClick={deleteClick}>
                            <img src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000" alt="delete icon" />
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card; 