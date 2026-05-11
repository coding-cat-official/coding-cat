import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BLANK_CONTRACT, ContractData } from "../../../types";
import { Box, Button, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import ContractEdit from "./ContractEdit";
import { supabase } from "../../../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useOutletContext } from "react-router-dom";

export default function Contract({ problemCountByCategory }: { problemCountByCategory: Record<string,number> }) {
  const [open, setOpen] = useState(false);
  const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [featureMap, setFeatureMap] = useState<Record<string, boolean>>({});

  const { session } = useOutletContext<{ session: Session | null }>();

  useEffect(()=> {
    supabase
      .from("activated")
      .select("topic, activated")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else if (data) {
          const map: Record<string,boolean> = {};
          data.forEach((r) => { map[r.topic] = r.activated; });
          setFeatureMap(map);
        }
      });
  }, []);

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
  }, [session]);

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
        </Stack>
        <Typography>Last Modified:{' '} 
        {lastUpdated
          ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : '—'}
        </Typography>
        <Button onClick={() => setOpen(true)}>
          Edit
        </Button>
      </Stack>

      <ContractModal 
        open={open} setOpen={setOpen} 
        contract={contract} lastUpdated={lastUpdated} 
        onSave={handleContractSave} 
        setContract={setContract} 
        featureMap={featureMap} 
        problemCountByCategory={problemCountByCategory}
      />
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
  featureMap: Record<string, boolean>;
  problemCountByCategory: Record<string, number>;
}

function ContractModal({ open, setOpen, contract, setContract, lastUpdated, onSave, featureMap, problemCountByCategory }: ContractModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
    
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog sx={{ backgroundColor: "#D4FF99", width: "90vw", height: "90vh", display: "flex", justifyContent: "flex-start" }} variant="outlined">
        <ModalClose />
        <Typography level="h2">Your Contract</Typography>
        <Box sx={{ overflowY: "scroll" }}>
          <ContractEdit 
            contract={contract} 
            setContract={setContract} 
            isUpdating={isUpdating}
            featureMap={featureMap} 
            problemCountByCategory={problemCountByCategory} 
          />
        </Box>
        { /* Last Edit Date and Buttons */ }
        <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
          { 
            !isUpdating && 
            <Typography level="body-xs">
              Last Modified: 
              {
                lastUpdated ? 
                  ` ${lastUpdated.toLocaleDateString()} 
                  ${lastUpdated.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}` 
                : '—'
              }
            </Typography> 
          }
          {
            isUpdating ?
              <>
                <Button sx={{ width: "15%" }} variant="outlined" onClick={() => setIsUpdating(false)}>Cancel</Button>
                <Button sx={{ width: "15%" }} onClick={async() => { await onSave(); setIsUpdating(false);}}>Save Changes</Button>
              </>
            : <Button sx={{ width: "15%" }} onClick={() => setIsUpdating(true)}>Edit</Button>
          }
        </Stack>
      </ModalDialog>
    </Modal>
  )
}
