import { Bounce, toast, TypeOptions } from "react-toastify";

export function handlerToast(msg: string, type: TypeOptions) {
  toast(msg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: type,
    theme: "light",
    transition: Bounce,
  });
}
