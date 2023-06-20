import React, { useState } from "react";
import { UploadFile } from "../services/api";

export default function AddProblemForm(){
    const [fname,setFName] = useState('');

    const handleUpload = async () =>{
        const data = new FormData();
        data.append("name",fname.name);
        data.append("file",fname);
        data.append("problem","64918007ba737a0902b15b06");
        const op = await UploadFile(data);
        console.log(op);
    }

    return (
        <>
            <input type="file" onChange={(ev)=>setFName(ev.target.files[0])}/>
            <button onClick={handleUpload}>press</button>
        </>
    );
}