import { Dispatch, SetStateAction } from "react";
import { ContractData } from "../../../types";
import { Button, Input, Option, Select, Stack, Table, Typography } from "@mui/joy";

interface ContractEditProps {
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  isUpdating: boolean;
  setIsUpdating: Dispatch<SetStateAction<boolean>>;
  onSave: () => Promise<void>;
  lastUpdated: Date | null;
  featureMap: Record<string,boolean>;
  problemCountByCategory: Record<string, number>;
}

export default function ContractEdit({ contract, setContract, isUpdating, setIsUpdating, onSave, lastUpdated, featureMap, problemCountByCategory }: ContractEditProps) {
  const baseCategories = ["Fundamentals", "Logic", "String-1", "List-1: Indexing"];
  const allCategories = Object.keys(contract.Coding.problemsToSolveByCategory);
  const categoriesToEdit = featureMap["CodingStage2"]
     ? allCategories
     : baseCategories.filter((c) => allCategories.includes(c));

  return (
    <>
      <Stack sx={{ overflowY: "scroll" }} gap={2}>
        <Typography level="h3">Coding</Typography>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography>What grade do you want to get?</Typography>
          {
            isUpdating ?
              <Select placeholder="Grade" value={contract.Coding.gradeWanted}
                onChange={(_, v) =>                          
                  setContract(c => ({
                    ...c,
                    Coding: { ...c.Coding, gradeWanted: v as string },
                  }))
                }
              >
                <Option value="proficient">Proficient</Option>
                <Option value="approaching_mastery">Approaching Mastery</Option>
                <Option value="mastery">Mastery</Option>
              </Select>
            : <Typography><strong>{contract.Coding.gradeWanted}</strong></Typography>
          }
        </Stack>

        <Typography sx={{ whiteSpace: "pre-line" }}>How many problems of each category will you solve?</Typography>
        <Stack justifyContent="center" direction="row" columnGap={20} rowGap={2} flexWrap="wrap">
          <Table sx={{ display: "flex", justifyContent: "center" }}>
            <tr>
              {
                categoriesToEdit.map((c) => {
                  return (
                    <td style={{ display: "inline-block" }}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography>{c}: </Typography>
                        {
                          isUpdating ?
                            <Input
                              variant="plain"
                              size="sm"
                              sx={{ width: "50px", typography: 'body1' }}
                              slotProps={{ input: { type: "number", min: 0, max: problemCountByCategory[c] ?? 10 } }}
                              placeholder="0"
                              value={contract.Coding.problemsToSolveByCategory[c]}
                              onChange={(e) =>
                                setContract((cat) => ({
                                  ...cat,
                                  Coding: {
                                    ...cat.Coding,
                                    problemsToSolveByCategory: {
                                      ...cat.Coding.problemsToSolveByCategory,
                                      [c]: +e.target.value,
                                    },
                                  },
                                }))
                              }
                            />
                          : <Typography><strong>{contract.Coding.problemsToSolveByCategory[c]}</strong></Typography>
                        }
                      </Stack>
                    </td>
                  )
                })
              }
            </tr>
          </Table>
        </Stack>

        <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
        {
          isUpdating ?
          <Input value={contract.Coding.codeDescription} 
            onChange={(e) =>
              setContract((c) => ({
                ...c,
                Coding: { ...c.Coding, codeDescription: e.target.value },
              }))
            } placeholder="Enter your answer..."
          />
          : <Typography><strong>{contract.Coding.codeDescription}</strong></Typography>
        }

        <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
        { 
          isUpdating ?
            <Input value={contract.Coding.reflectionPlan} 
              onChange={(e) =>
                setContract((c) => ({
                  ...c,
                  Coding: { ...c.Coding, reflectionPlan: e.target.value },
                }))
              } placeholder="Enter your answer..."
            />
          : <Typography><strong>{contract.Coding.reflectionPlan}</strong></Typography>
        }

        {featureMap["Haystack"] && (
          <>
            <Typography level="h3">Haystack</Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography>What grade do you want to get?</Typography>
              {
                isUpdating ?
                  <Select placeholder="Grade" value={contract.Haystack.gradeWanted} 
                    onChange={(_, v) =>
                      setContract(c => ({
                        ...c,
                        Haystack: { ...c.Haystack, gradeWanted: v as string },
                      }))
                    }
                  >
                    <Option value="proficient">Proficient</Option>
                    <Option value="approaching_mastery">Approaching Mastery</Option>
                    <Option value="mastery">Mastery</Option>
                  </Select>
                : <Typography><strong>{contract.Haystack.gradeWanted}</strong></Typography>
              }
            </Stack>

            <Stack direction="row" alignItems="center" gap={2}>
              <Typography>How many haystack problems will you solve?</Typography>
              { 
                isUpdating ?
                  <Input slotProps={{input:{type:"number", min: 0}}} value={contract.Haystack.problemsToSolve} 
                    onChange={(e) =>
                      setContract((c) => ({
                        ...c,
                        Haystack: { ...c.Haystack, problemsToSolve: +e.target.value },
                      }))
                    } sx={{ width: "4em" }} placeholder="0"
                  />
                : <Typography><strong>{contract.Haystack.problemsToSolve}</strong></Typography>
              }
            </Stack>

            <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
            {
              isUpdating ?
                <Input placeholder="Enter your answer..." value={contract.Haystack.codeDescription} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Haystack: { ...c.Haystack, codeDescription: e.target.value },
                    }))
                  }
                />
              : <Typography><strong>{contract.Haystack.codeDescription}</strong></Typography>
            }

            <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
            {
              isUpdating ?
                <Input placeholder="Enter your answer..." value={contract.Haystack.reflectionPlan} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Haystack: { ...c.Haystack, reflectionPlan: e.target.value },
                    }))
                  }
                />
              : <Typography><strong>{contract.Haystack.reflectionPlan}</strong></Typography>
            }
            </>
        )}

        {featureMap["Mutation"] && (
          <>
            <Typography level="h3">Mutation Testing</Typography>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography>What grade do you want to get?</Typography>
              {
                isUpdating ?
                  <Select placeholder="Grade" value={contract.Mutation.gradeWanted}
                    onChange={(_, v) =>
                      setContract(c => ({
                        ...c,
                        Mutation: { ...c.Mutation, gradeWanted: v as string },
                      }))
                    }>
                    <Option value="proficient">Proficient</Option>
                    <Option value="approaching_mastery">Approaching Mastery</Option>
                    <Option value="mastery">Mastery</Option>
                  </Select>
                : <Typography><strong>{contract.Mutation.gradeWanted}</strong></Typography>
              }
            </Stack>

            <Stack direction="row" alignItems="center" gap={2}>
              <Typography>How many mutation testing problems will you solve?</Typography>
              {
                isUpdating ? 
                  <Input sx={{ width: "4em" }} placeholder="0" slotProps={{input:{type:"number", min: 0}}} value={contract.Mutation.problemsToSolve} 
                    onChange={(e) =>
                      setContract((c) => ({
                        ...c,
                        Mutation: { ...c.Mutation, problemsToSolve: +e.target.value },
                      }))
                    }
                  />
                : <Typography><strong>{contract.Mutation.problemsToSolve}</strong></Typography>
              } 
            </Stack>

            <Typography>Give a qualitative description of what your code will look like in order to achieve your desired grade.</Typography>
            {
              isUpdating ?
                <Input placeholder="Enter your answer..." value={contract.Mutation.codeDescription} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Mutation: { ...c.Mutation, codeDescription: e.target.value },
                    }))
                  }
                />
              : <Typography>{contract.Mutation.codeDescription}</Typography>
            }

            <Typography>How many reflections will you do in order to reach your desired grade and how in depth will you go with them?</Typography>
            {
              isUpdating ?
                <Input placeholder="Enter your answer..." value={contract.Mutation.reflectionPlan} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Mutation: { ...c.Mutation, reflectionPlan: e.target.value },
                    }))
                  }
                />
              : <Typography><strong>{contract.Mutation.reflectionPlan}</strong></Typography>
            }
            </>
        )}
      </Stack>

      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
        <Typography level="body-xs">
          Last Modified: 
          {
            lastUpdated ? 
              `${lastUpdated.toLocaleDateString()} 
              ${lastUpdated.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}` 
            : '—'
          }
        </Typography>
        {
          isUpdating ?
            <>
              <Button sx={{ width: "15%" }} variant="outlined" onClick={() => setIsUpdating(false)}>Cancel</Button>
              <Button sx={{ width: "15%" }} onClick={async() => { await onSave(); setIsUpdating(false);}}>Save Changes</Button>
            </>
          : <Button sx={{ width: "15%" }} onClick={() => setIsUpdating(true)}>Edit</Button>
        }
      </Stack>
    </>
  )
}
