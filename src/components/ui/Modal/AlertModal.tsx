import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Button } from "@supabase/ui";
import type { Dispatch, FC, SetStateAction } from "react";

type Props = {
  title: string;
  message: string;
  onClick: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AlertModal: FC<Props> = (props) => {
  const { isOpen, message, onClick, setIsOpen, title } = props;

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay className="fixed inset-0" />
      <ModalContent>
        <ModalHeader className="text-2xl font-bold text-center text-[#070417]">
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody className="py-4 font-thin text-center text-[#070417]">
          {message}
        </ModalBody>

        <ModalFooter>
          <Button
            className="z-10 py-3 px-8 text-[#070417] bg-[#F1F5F9] rounded-full border-none hover:opacity-70"
            onClick={() => setIsOpen(false)}
          >
            キャンセル
          </Button>
          <Button
            className="z-10 py-3 px-12 text-white bg-[#EF4444] rounded-full hover:opacity-70"
            onClick={onClick}
          >
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
