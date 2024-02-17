"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function DarkToastContainerWrapper() {
  return <ToastContainer position={"bottom-right"} theme="dark" />;
}

export function LightToastContainerWrapper() {
  return <ToastContainer position={"bottom-right"} theme="light" />;
}
