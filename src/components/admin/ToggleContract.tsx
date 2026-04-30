import { Modal, Box, Typography } from "@mui/joy";

interface ToggleContractProps {
  open: boolean;
  handleClose: () => void;
}

const styles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'beige',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function ToggleContract({ open, handleClose }: ToggleContractProps) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles}>
        <Typography id="modal-modal-title">
          Change Read/Write on Contract
        </Typography>
      </Box>
    </Modal>
  );
}
