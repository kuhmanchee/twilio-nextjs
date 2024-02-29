'use client';

import { useEffect, useState } from "react";

export default function LocalStorageData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Retrieve data from local storage
    const storedData = localStorage.getItem("PRPBackupData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="consiner p-4 ">
      <h1 className="text-center">PRP Local Data</h1>
      <ul className="mb-4" >
        {data.map((item, index) => (
          <li key={index} className="mb-4">
            <strong>Name:</strong> {item.name}<br />
            <strong>Hospital Name:</strong> {item.hospitalName}<br />
            <strong>Designation:</strong> {item.designation}<br />
            <strong>Speciality:</strong> {item.speciality}<br />
            <strong>Phone Number:</strong> {item.phoneNumber}<br />
          </li>
        ))}
      </ul>
    </div>
  );
}
