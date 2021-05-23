import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputComponent from "./UI_components/InputComponent";
import ConfirmComponent from "./UI_components/ConfirmComponent";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 3,
  },
}));

export default function ModalPanel(props) {
  const classes = useStyles();

  const handleSubmit = (value, e) => {
    if (e) e.preventDefault();
    props.onSubmit(value);
  };

  const handleEscape = () => {
    props.onEscape();
  };

  const content = () => {
    if (props.action === "input")
      return (
        <InputComponent
          label={props.label}
          value=""
          onSubmit={handleSubmit}
          onEscape={handleEscape}
        />
      );
    if (props.action === "confirm")
      return (
        // <SubmitComponent
        //   label={props.label}
        //   value=""
        //   onSubmit={handleSubmit}
        //   onEscape={handleEscape}
        //   selected={props.selected}
        // />
        <div>
          <p>Confirm file delete</p>
          <ConfirmComponent onConfirm={handleSubmit} onCancel={handleEscape} />
        </div>
      );
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.isOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <div className={classes.paper} noValidate autoComplete="off">
            {content()}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
