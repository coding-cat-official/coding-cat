import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BLANK_CONTRACT, CategoryData, ContractData, StudentRecord } from "../../../types";
import { Box, Button, Modal, ModalClose, ModalDialog, Stack, Typography } from "@mui/joy";
import ContractEdit from "./ContractEdit";
import { supabase } from "../../../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { useOutletContext } from "react-router-dom";
import { fetchContractPerms } from "../../../utils/contractPerms";

interface ContractProps {
  categoriesData: CategoryData[];
  profileData?: StudentRecord;
}

export default function Contract({ categoriesData, profileData }: ContractProps) {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [problemCountByCategory, setProblemCountByCategory] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
  const [loading, setLoading] = useState(false);
  const [featureMap, setFeatureMap] = useState<Record<string, boolean>>({});

  // Handles if profile id comes from session or profiledata prop
  const outletContext = useOutletContext<{ session: Session | null } | undefined>();
  const session = outletContext?.session;
  const profileId = profileData?.profile_id ?? session?.user.id;

  if (!profileId) {
    throw Error("Error: No session or profile_id has been defined");
  }

  // if the categoriesData changes, update the problem count
  useEffect(() => {
    const probCountByCat = Object.fromEntries(
      categoriesData.map(({ category, total }) => [category, total]),
    );
    setProblemCountByCategory(probCountByCat);
  }, [categoriesData, setProblemCountByCategory]);

  useEffect(() => {
    supabase
      .from("activated")
      .select("topic, activated")
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
        } else if (data) {
          const map: Record<string, boolean> = {};
          data.forEach((r) => {
            map[r.topic] = r.activated;
          });
          setFeatureMap(map);
        }
      });
  }, []);

  useEffect(() => {
    (async function fetchContract() {
      const { data, error } = await supabase
        .from("contracts")
        .select("data, updated_at")
        .eq("profile_id", profileId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error(error);
      } else {
        setContract(data.data as ContractData);
        setLastUpdated(new Date(data.updated_at));
      }
    })();
  }, [profileId]);

  async function handleContractSave() {
    const now = new Date();
    const { error, data } = await supabase
      .from("contracts")
      .upsert({
        profile_id: profileId,
        data: contract,
        updated_at: now,
      })
      .select("data, updated_at")
      .single();

    if (error) {
      console.error(error);
    } else {
      setContract(data.data as ContractData);
      setLastUpdated(new Date(data.updated_at));
    }

    setLoading(false);
  }

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Stack alignItems="center">
        <Typography>
          Last Modified:{" "}
          {lastUpdated
            ? `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`
            : "—"}
        </Typography>
        <Button onClick={() => setOpen(true)}>View Contract</Button>
      </Stack>

      <ContractModal
        open={open}
        setOpen={setOpen}
        contract={contract}
        lastUpdated={lastUpdated}
        onSave={handleContractSave}
        setContract={setContract}
        featureMap={featureMap}
        problemCountByCategory={problemCountByCategory}
        profileData={profileData}
      />
    </>
  );
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
  profileData?: StudentRecord;
}

function ContractModal({
  open,
  setOpen,
  contract,
  setContract,
  lastUpdated,
  onSave,
  featureMap,
  problemCountByCategory,
  profileData
}: ContractModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const checkIfReadOnly = async () => {
      try {
        if(profileData && profileData.contract_override === true){
          setIsReadOnly(false)
        } else {
          setIsReadOnly(await fetchContractPerms());
        }
      } catch (error) {
        console.error("Contract read-only setting could not be loaded", error);
      }
    };
    checkIfReadOnly();
  }, [profileData]);

  /**
   * This function enforces a max and min of submitted values
   * for completed problems then calls the onSave function
   */
  const capProblemsAndSave = async () => {
    if (featureMap["CodingStage2"]) {
      let codingCategories = Object.keys(contract.Coding.problemsToSolveByCategory);

      codingCategories.forEach((cat, i) => {
        contract.Coding.problemsToSolveByCategory[cat] = Math.max(
          0,
          Math.min(contract.Coding.problemsToSolveByCategory[cat], problemCountByCategory[cat]),
        );
      });
    }
    if (featureMap["Haystack"]) {
      contract.Haystack.problemsToSolve = Math.max(
        0,
        Math.min(contract.Haystack.problemsToSolve, problemCountByCategory["haystack"]),
      );
    }
    if (featureMap["Mutation"]) {
      contract.Mutation.problemsToSolve = Math.max(
        0,
        Math.min(contract.Mutation.problemsToSolve, problemCountByCategory["mutation"]),
      );
    }

    await onSave();
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{
          backgroundColor: "#D4FF99",
          width: "90vw",
          height: "90vh",
          display: "flex",
          justifyContent: "flex-start",
        }}
        variant="outlined"
      >
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
        {/* Last Edit Date and Buttons */}
        <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
          {!isUpdating && (
            <Typography level="body-xs">
              Last Modified:
              {lastUpdated
                ? ` ${lastUpdated.toLocaleDateString()} 
                  ${lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "—"}
            </Typography>
          )}
          {isUpdating ? (
            <>
              <Button sx={{ width: "15%" }} variant="outlined" onClick={() => setIsUpdating(false)}>
                Cancel
              </Button>
              <Button
                sx={{ width: "15%" }}
                onClick={async () => {
                  await capProblemsAndSave();
                  setIsUpdating(false);
                }}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              {isReadOnly && (
                <Typography fontWeight="bold" sx={{ mr: 2 }}>
                  CONTRACT IS SET TO READ-ONLY
                </Typography>
              )}
              <Button
                sx={{ width: "15%" }}
                onClick={() => setIsUpdating(true)}
                disabled={isReadOnly}
              >
                Edit
              </Button>
            </>
          )}
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
