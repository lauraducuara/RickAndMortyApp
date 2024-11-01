
import { toast } from "react-toastify";

export const CreateMessage = (textMessage: string, typeMessage: string) => {


  switch (typeMessage) {
    case "info":
      toast(textMessage, {
        type: "info",
        theme: "colored",
        autoClose: 5000,
        closeOnClick: true,
        position: "top-center",
      });
      break;
    case "success":
      toast(textMessage, {
        type: "success",
        theme: "dark",
        autoClose: 5000,
        closeOnClick: true,
        position: "top-center",
      });
      break;
    case "error":
      toast(textMessage, {
        type: "error",
        theme: "light",
        autoClose: 5000,
        closeOnClick: true,
        position: "top-center",
      });
      break;
    case "warning":
      toast(textMessage, {
        type: "warning",
        theme: "colored",
        autoClose: 5000,
        closeOnClick: true,
        position: "top-center",
      });
      break;
    default:
      toast(textMessage, {
        type: "default",
        theme: "dark",
        autoClose: 5000,
        closeOnClick: true,
        position: "top-center",
      });
      break;
  }
};

export default CreateMessage;
