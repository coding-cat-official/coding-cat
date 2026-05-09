import { Modal, Box, Typography, Switch } from "@mui/joy";
import { ReactNode } from "react";

// Interface for Modal Props
interface AdminPageModalProps {
  open: boolean;
  handleClose: () => void;
  modalTitle: string;
  modalDesc: string;
  switchLabel?: string;
  switchAction?: () => void;
  extraNode: ReactNode;
}

// Style for modal itself
const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "beige",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

/**
 * A component that acts a modal template for the links in the admin dashboard
 * @param open Defines whether the module is open or not
 * @param handleClose Function that defines how to handle closing the modal
 * @param modalTitle String that defines the title of the modal
 * @param modalDesc String that defines the description of the modal
 * @returns <AdminPageModal {...props} />
 */
export default function AdminPageModal({
  open,
  handleClose,
  modalTitle,
  modalDesc,
  switchLabel,
  switchAction,
  extraNode
}: AdminPageModalProps) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles}>
        <Typography id="modal-modal-title" component="h2">
          {modalTitle}
        </Typography>

        <Typography id="modal-modal-description">{modalDesc}</Typography>

        {switchLabel && (
          <Typography component="label" endDecorator={<Switch onChange={switchAction}/>}>
            {switchLabel}
          </Typography>
        )}
        {extraNode}
      </Box>
    </Modal>
  );
}
