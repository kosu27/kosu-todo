import { useRouter } from "next/router";
import { CgClose } from "react-icons/cg";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

type Props = {
  name: string;
  isClose?: boolean;
};

export const MyPageHeader = (props: Props) => {
  const { isClose, name } = props;
  const router = useRouter();

  const handleBack = () => {
    if (isClose) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <header className="flex relative items-center m-auto h-20">
      <button className="absolute left-14 sm:left-40" onClick={handleBack}>
        {isClose ? (
          <CgClose size={24} />
        ) : (
          <MdOutlineArrowBackIosNew size={24} />
        )}
      </button>
      <div className="m-auto text-xl font-bold text-center">{name}</div>
    </header>
  );
};
