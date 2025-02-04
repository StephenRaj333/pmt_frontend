import React, { useState, useRef } from 'react';
import { CSVLink } from 'react-csv';

const DownloadCSV = ({ data, onClick ,fileName}: any) => { 
  const [download, setDownload] = useState(false);
  const csvLinkRef = useRef<any>(null);

  const headers = [
    { label: 'Task ID', key: '_id' },
    { label: 'User Name', key: 'userName' },
    { label: 'User Email', key: 'userEmail' },
    { label: 'Task Name', key: 'taskName' },
    { label: 'Task Description', key: 'taskDesc' },
    { label: 'Priority', key: 'priority' },
    { label: 'Deadline', key: 'deadline' },
    { label: 'Status', key: 'status' },
    { label: 'Tech Stacks', key: 'techStacks' },
    { label: 'Team Lead', key: 'teamLead' }
  ];

  const formattedData = data.map((item: any) => ({
    ...item,
    techStacks: item.techStacks.join(', ')
  }));

  const handleDownload = () => {
    setDownload(true);
    setTimeout(() => setDownload(false), 100);
    if (onClick) onClick(); // Call the parent's onClick function
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click(); // Trigger download manually
    }
  };

  return (
    <div>
     <button onClick={handleDownload} type="button" className="text-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:hover:border-gray-600 dark:focus:ring-gray-700">Download CSV</button>   
      <CSVLink
        ref={csvLinkRef}
        data={formattedData}
        headers={headers}
        filename={`${fileName}.csv`} 
        style={{ display: 'none' }} // Hidden link, but can be triggered
      >
        Download
      </CSVLink>
    </div>
  );
};

export default DownloadCSV;
