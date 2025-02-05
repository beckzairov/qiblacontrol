"use client";
import { API_ROUTES } from "@/utils/apiRoutes";
import { useState } from "react";
export default function For() {
    const [test, setTest] = useState(null);
    const res = fetch(API_ROUTES.TEST)
    .then((response) => response.json())
        .then((data) => {
          setTest(data);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
        
    return(
        <>
            <div className="text-6xl">THIS IS FOR PAGE</div>
        </>
    )
}