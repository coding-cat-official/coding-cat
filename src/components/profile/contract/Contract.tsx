import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BLANK_CONTRACT, ContractData } from "../../../types";
import { IconButton, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import { ArrowSquareOut } from "@phosphor-icons/react";
import ContractEdit from "./ContractEdit";
import ContractText from "./ContractText";
import { supabase } from "../../../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useOutletContext } from "react-router-dom";

export default function Contract() {
  const [open, setOpen] = useState(false);
  const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const { session } = useOutletContext<{ session: Session | null }>();

  useEffect(() => {
    (async function fetchContract() {
      const {data, error} = await supabase
      .from('contracts')
      .select('data, updated_at')
      .eq('profile_id', session?.user.id)
      .order('updated_at', {ascending:false})
      .limit(1)
      .single()
      
      if (error) {
        console.error(error);
      } else {
        setContract(data.data as ContractData);
        setLastUpdated(new Date(data.updated_at));
      }
    })();
  }, [session])

  async function handleContractSave() {
    const now = new Date()
    const {error, data } = await supabase
    .from('contracts')
    .upsert({
      profile_id: session?.user.id,
      data: contract,
      updated_at: now
    })
    .select('data, updated_at')
    .single()
    
    if (error) {
      console.error(error);
    }
    else {
      setContract(data.data as ContractData);
      setLastUpdated(new Date(data.updated_at));
    }
  
    setLoading(false);
  }

  if (loading) {
    return (
      <Typography>Loading...</Typography>
    )
  }

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

      <ContractModal open={open} setOpen={setOpen} contract={contract} lastUpdated={lastUpdated} onSave={handleContractSave} setContract={setContract}/>
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
          <ContractText contract={contract} setIsUpdating={setIsUpdating} lastUpdated={lastUpdated} />
        }
      </ModalDialog>
    </Modal>
  )
}
