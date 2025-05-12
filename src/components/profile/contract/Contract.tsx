import { Dispatch, SetStateAction, useState } from "react";
import { ContractData } from "../../../types";
import { IconButton, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import { ArrowSquareOut } from "@phosphor-icons/react";
import ContractEdit from "./ContractEdit";
import ContractText from "./ContractText";

interface ContractProps{
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  lastUpdated: Date | null;
  onSave: () => Promise<void>;
}

export default function Contract({ contract, setContract, lastUpdated, onSave }: ContractProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack alignItems="center">
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography level="h2">Contract</Typography>
          <IconButton onClick={() => setOpen(true)}>
            <ArrowSquareOut size={23} />
          </IconButton>
        </Stack>
        <Typography>Last Modified:{' '} 
        {lastUpdated
          ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : '—'}
        </Typography>
      </Stack>

      <ContractModal open={open} setOpen={setOpen} contract={contract} lastUpdated={lastUpdated} onSave={onSave} setContract={setContract}/>
    </>
  )
}

interface ContractModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  lastUpdated: Date | null;
  onSave: () => Promise<void>;
}

function ContractModal({ open, setOpen, contract, setContract, lastUpdated, onSave }: ContractModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
    
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ width: "90vw", height: "90vh" }} variant="outlined">
        <ModalClose />
        <Typography level="h2">Your Contract</Typography>
        {
          isUpdating ? 
          <ContractEdit contract={contract} setIsUpdating={setIsUpdating} setContract={setContract} onSave={onSave} /> :
          <ContractText setIsUpdating={setIsUpdating} contract={contract} lastUpdated={lastUpdated} />
        }
      </ModalDialog>
    </Modal>
  )
}
