import toast from "react-hot-toast";

export const useToast = () => {
  const successToast = (msg: string) => toast.success(msg);
  const errorToast = (msg: string) => toast.error(msg);
  const warnningToast = (msg: string) => toast(msg, { icon: "🤔" });
  return {
    successToast,
    errorToast,
    warnningToast,
  };
};
