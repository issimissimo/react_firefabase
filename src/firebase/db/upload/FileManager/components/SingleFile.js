import React, { useState, useEffect, useRef } from "react";
import "./SingleFile.css"

function SingleFile ({item}) {

    const handleClick = () =>{
        console.log(item)
    }

    return(
        <div className="SingleFile" onClick={handleClick}>
            {item.icon}
            <span>{item.key}</span>
        </div>
    )
}

export default SingleFile;