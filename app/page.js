"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twilioCode, setTwilioCode] = useState("");
  const [visible, setVisible] = useState(false);

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const handlePhoneNumberSubmit = async (e) => {
    try {
      e.preventDefault();
      const cleanedNumber = cleanPhoneNumber(phoneNumber);
      const response = await fetch(
        `/api/twilio?phoneNumber=${encodeURIComponent(cleanedNumber)}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      setVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 lg:p-24">
      <div className={styles.neu}>
        <div className="w-max">
          {!visible ? (
            <form onSubmit={handlePhoneNumberSubmit}>
              <div className="form-control w-full max-w-xs">
                <label className="label" htmlFor="phoneNumber">
                  <span className="label-text uppercase">Phone Number</span>
                </label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="(222)-222-2222"
                  className="input input-bordered w-full max-w-xs"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  required={!visible}
                />
              </div>
              <button className="btn btn-wide my-4">Submit</button>
            </form>
          ) : (
            <form>
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
                />
              </div>
              <button className="btn btn-wide my-4">Submit</button>
            </form>
          )}
        </div>
      </div>
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
  const formattedNumber = "+1" + cleanedNumber;
  return formattedNumber;
}
