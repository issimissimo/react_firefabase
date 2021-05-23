import React, { useState } from "react";
import { Button } from "@material-ui/core";
import "./ConfirmComponent.css"

function ConfirmComponent ({onConfirm, onCancel}) {

    return(
        <div className="ConfirmComponent">
            <Button className="ConfirmComponent-button" onClick={onConfirm}>OK</Button>
            <Button className="ConfirmComponent-button" onClick={onCancel}>Cancel</Button>
        </div>
    )

}

export default ConfirmComponent