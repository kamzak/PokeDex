import { Fragment } from "react";
import ReactDOM from "react-dom";

import classes from "./Modal.module.css";
import "animate.css";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div
      className={`${classes.modal} animate__animated animate__flipInY ${props.class}`}
      style={{ boxShadow: `0px 0px 9px 4px ${props.typeColor}` }}
    >
      <div className={classes.content}>
      <span className={classes.close} onClick={props.onClose}>X</span>
        {props.children}
        </div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose} class={props.class} typeColor={props.typeColor}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
