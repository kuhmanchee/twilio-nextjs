"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { Toaster, toast } from "sonner";
import Image from "next/image";
import logo from "@/public/teralife-logo.svg";



export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twilioCode, setTwilioCode] = useState("");
  const [name, setName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [designation, setDesignation] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [visible, setVisible] = useState(false);
  const [verified, setVerified] = useState(false);

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const handleTwilioCodeChange = (e) => {
    const formattedTwilioCode = formatTwilioCode(e.target.value);
    setTwilioCode(formattedTwilioCode);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleHospitalNameChange = (e) => {
    setHospitalName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  const handleSpecialityChange = (e) => {
    setSpeciality(e.target.value);
  };


  const handlePhoneNumberSubmit = async (e) => {
    try {
      e.preventDefault();
      const cleanedNumber = cleanPhoneNumber(phoneNumber);
      const existingDataString = localStorage.getItem("PRPBackupData");
      const existingData = existingDataString ? JSON.parse(existingDataString) : [];

      // Backup current data
      const currentData = {
        name: name,
        hospitalName: hospitalName,
        designation: designation,
        speciality: speciality,
        phoneNumber: cleanedNumber
      };
      const updatedData = [...existingData, currentData];
      localStorage.setItem("PRPBackupData", JSON.stringify(updatedData));
      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(
            `https://teralifebackend.onrender.com/api/prps`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.STRAPI_FULL_SECRET || 'fc6f0f047230ede9b32572624ed1910016fe9bd8dfea4a4a17c494aa79424cc6147721432aaeec7297c022d482eb62da27980bec5040885cb5cd1394d24e12d5702b73671d2ad5bfc69e25edde116957162d3f9a2379dc69f5686be62a2e68809b954b513a3d52d31f159a56f0e7691a649df89a3c940dc3ba46f46b89754684'}`
              },
              body: JSON.stringify({
                data: {
                  name: name,
                  hospitalName: hospitalName,
                  designation: designation,
                  speciality: speciality,
                  phoneNumber: cleanedNumber
                }

              }),
            }
          );
          const data = await response.json();
          console.log(data)
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(promise, {
        loading: "Adding Data...",
        success: (data) => {
          return "Data Saved Successfully. ";
        },
        error: "Something went wrong.",
      });

      promise.then(() => {
        const otpPromise = new Promise(async (resolve, reject) => {
          try {
            const response = await fetch(
              `/api/twilio?phoneNumber=${encodeURIComponent(cleanedNumber)}`,
              {
                method: "GET",
              }
            );
            const data = await response.json();
            resolve(data);
            setVisible(true);

          } catch (error) {
            reject(error);
          }
        });

        toast.promise(otpPromise, {
          loading: "Sending code to phone.",
          success: (data) => {
            return "Please check your phone for a code.";
          },
          error: "Something went wrong.",
        });
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };


  const handleTwilioCodeSubmit = async (e) => {
    try {
      e.preventDefault();
      const cleanedCode = cleanTwilioCode(twilioCode);
      const cleanedNumber = cleanPhoneNumber(phoneNumber);
      const promise = new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(`/api/twilio`, {
            method: "POST",
            body: JSON.stringify({
              code: cleanedCode,
              phoneNumber: cleanedNumber,
            }),
          });
          const data = await response.json();
          resolve(data);
          setVerified(true);
        } catch (error) {
          reject(error);
        }
      });

      toast.promise(promise, {
        loading: "Verifying code ...",
        success: (data) => {
          return "Successfully verified.";
        },
        error: "Invalid code. Please try again.",
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-12">
      <Toaster position="top-center" />
      <section className="mb-8 flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold text-center ">
          <Image src={logo} alt="logo" width={150} height={150}></Image>
        </h1>

        <h2 className="text-xl max-w-screen-sm text-center">
          PRP Onboarding
        </h2>
      </section>

      {!verified ? (
        <div className={styles.neu}>
          <div className="w-max">
            {!visible ? (
              <form onSubmit={handlePhoneNumberSubmit}>
                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="name">
                    <span className="label-text uppercase">Name</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="input input-bordered w-full max-w-xs"
                    value={name}
                    onChange={handleNameChange}
                    required={!visible}
                  />
                </div>

                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="name">
                    <span className="label-text uppercase">Hospital Name</span>
                  </label>
                  <input
                    name="hospitalName"
                    type="text"
                    placeholder="Hospital Name"
                    className="input input-bordered w-full max-w-xs"
                    value={hospitalName}
                    onChange={handleHospitalNameChange}
                    required={!visible}
                  />
                </div>

                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="name">
                    <span className="label-text uppercase">Designation</span>
                  </label>
                  <input
                    name="designation"
                    type="text"
                    placeholder="Designation"
                    className="input input-bordered w-full max-w-xs"
                    value={designation}
                    onChange={handleDesignationChange}
                    required={!visible}
                  />
                </div>
                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="name">
                    <span className="label-text uppercase">Speciality</span>
                  </label>
                  <input
                    name="speciality"
                    type="text"
                    placeholder="Speciality"
                    className="input input-bordered w-full max-w-xs"
                    value={speciality}
                    onChange={handleSpecialityChange}
                    required={!visible}
                  />
                </div>

                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="phoneNumber">
                    <span className="label-text uppercase">Phone Number</span>
                  </label>
                  <input
                    name="phoneNumber"
                    type="text"
                    placeholder="222-222-2222"
                    className="input input-bordered w-full max-w-xs"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required={!visible}
                  />
                </div>
                <button className="btn btn-wide my-4">Submit</button>
              </form>
            ) : (
              <form onSubmit={handleTwilioCodeSubmit}>
                <div className="form-control w-full max-w-xs">
                  <label className="label" htmlFor="twilioCode">
                    <span className="label-text uppercase">
                      Verification Code
                    </span>
                  </label>
                  <input
                    name="twilioCode"
                    type="text"
                    placeholder="222-222"
                    className="input input-bordered w-full max-w-xs"
                    required={visible}
                    value={twilioCode}
                    onChange={handleTwilioCodeChange}
                  />
                </div>
                <button className="btn btn-wide my-4 w-full">Submit</button>
              </form>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-6xl mt-16">👍</h1>
        </>
      )}
    </main>
  );
}

function formatPhoneNumber(value) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

function cleanPhoneNumber(phoneNumber) {
  const cleanedNumber = phoneNumber.replace(/\D/g, "");
  const formattedNumber = "+91" + cleanedNumber;
  return formattedNumber;
}

function formatTwilioCode(value) {
  if (!value) return value;
  const code = value.replace(/[^\d]/g, "");
  const codeLength = code.length;
  if (codeLength < 4) {
    return code;
  } else {
    return `${code.slice(0, 3)}-${code.slice(3, 6)}`;
  }
}

function cleanTwilioCode(code) {
  const cleanedCode = code.replace(/\D/g, "");
  return cleanedCode;
}
