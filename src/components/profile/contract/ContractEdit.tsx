import { Dispatch, ReactNode, SetStateAction } from "react";
import { ContractData } from "../../../types";
import { Box, Button, Input, Option, Select, Stack, Table, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

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
  // REMOVE LATER
  featureMap = {
    "CodingStage2": true,
    "Haystack": true,
    "Mutation": true
  }
  const categoriesToEdit = featureMap["CodingStage2"]
    ? allCategories
    : baseCategories.filter((c) => allCategories.includes(c));

  const rowStyle: SxProps = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    margin: "10px",
    marginLeft: "0"
  }

  const sectionStyle: SxProps = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingX: 4,
    paddingY: 2
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", overflowY: "scroll" }}>
      <Box sx={sectionStyle}>
        <Typography level="h3">Coding</Typography>

        <Box sx={rowStyle}>
          <ContractQuestion 
            question={"What grade do you want to get?"}
          />
          <ContractInput
            answer={contract.Coding.gradeWanted}
            isUpdating={isUpdating}
            element={
              <Select placeholder="Grade" value={contract.Coding.gradeWanted} 
                onChange={(_, v) =>
                  setContract(c => ({
                    ...c,
                    Coding: { ...c.Coding, gradeWanted: v as string },
                  }))
                }
              >
                <Option value="Proficient">Proficient</Option>
                <Option value="Approaching Mastery">Approaching Mastery</Option>
                <Option value="Mastery">Mastery</Option>
              </Select>
            }
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }} >
          <ContractQuestion question={"How many problems of each category will you solve?"} />
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
                          : <Typography><strong>{contract.Coding.problemsToSolveByCategory[c]}/{problemCountByCategory[c]}</strong></Typography>
                        }
                      </Stack>
                    </td>
                  )
                })
              }
            </tr>
          </Table>
        </Box>
        
        <Box sx={rowStyle}>
          <ContractQuestion
            question={"Give a qualitative description of what your code will look like in order to achieve your desired grade."}
          />
          <ContractInput
            answer={contract.Coding.codeDescription}
            isUpdating={isUpdating}
            element={
              <Input value={contract.Coding.codeDescription} 
                onChange={(e) =>
                  setContract((c) => ({
                    ...c,
                    Coding: { ...c.Coding, codeDescription: e.target.value },
                  }))
                } placeholder="Enter your answer..."
              />
            }
          />
        </Box>

        <Box sx={rowStyle}>
          <ContractQuestion
            question={"How many reflections will you do in order to reach your desired grade and how in depth will you go with them?"}
          />
          <ContractInput
            answer={contract.Coding.reflectionPlan}
            isUpdating={isUpdating}
            element={
              <Input value={contract.Coding.reflectionPlan} 
                onChange={(e) =>
                  setContract((c) => ({
                    ...c,
                    Coding: { ...c.Coding, reflectionPlan: e.target.value },
                  }))
                } placeholder="Enter your answer..."
              />
            }
          />
        </Box>
      </Box>

      {featureMap["Haystack"] && (
        <Box sx={sectionStyle}>
          <Typography level="h3">Haystack</Typography>
          <Box sx={rowStyle}>
            <ContractQuestion
              question={"What grade do you want to get?"}
            />
            <ContractInput
              answer={contract.Haystack.gradeWanted}
              isUpdating={isUpdating}
              element={
                <Select placeholder="Grade" value={contract.Haystack.gradeWanted} 
                  onChange={(_, v) =>
                    setContract(c => ({
                      ...c,
                      Haystack: { ...c.Haystack, gradeWanted: v as string },
                    }))
                  }
                >
                  <Option value="Proficient">Proficient</Option>
                  <Option value="Approaching Mastery">Approaching Mastery</Option>
                  <Option value="Mastery">Mastery</Option>
                </Select>
              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"How many haystack problems will you solve?"}
            />
            <ContractInput
              answer={contract.Haystack.problemsToSolve}
              isUpdating={isUpdating}
              element={
                <Input slotProps={{input:{type:"number", min: 0}}} value={contract.Haystack.problemsToSolve} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Haystack: { ...c.Haystack, problemsToSolve: +e.target.value },
                    }))
                  } sx={{ width: "4em" }} placeholder="0"
                />
              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"Give a qualitative description of what your code will look like in order to achieve your desired grade."}
            />
            <ContractInput
              answer={contract.Haystack.codeDescription}
              isUpdating={isUpdating}
              element={
                <Input placeholder="Enter your answer..." value={contract.Haystack.codeDescription} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Haystack: { ...c.Haystack, codeDescription: e.target.value },
                    }))
                  }
                />

              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"How many reflections will you do in order to reach your desired grade and how in depth will you go with them?"}
            />
            <ContractInput
              answer={contract.Haystack.reflectionPlan}
              isUpdating={isUpdating}
              element={
                <Input placeholder="Enter your answer..." value={contract.Haystack.reflectionPlan} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Haystack: { ...c.Haystack, reflectionPlan: e.target.value },
                    }))
                  }
                />
              }
            />
          </Box>
        </Box>
      )}

      {featureMap["Mutation"] && (
        <Box sx={sectionStyle}>
          <Typography level="h3">Mutation Testing</Typography>
          
          <Box sx={rowStyle}>
            <ContractQuestion
              question={"What grade do you want to get?"}
            />
            <ContractInput
              answer={contract.Mutation.gradeWanted}
              isUpdating={isUpdating}
              element={
                <Select placeholder="Grade" value={contract.Mutation.gradeWanted}
                  onChange={(_, v) =>
                    setContract(c => ({
                      ...c,
                      Mutation: { ...c.Mutation, gradeWanted: v as string },
                    }))
                  }>
                  <Option value="Proficient">Proficient</Option>
                  <Option value="Approaching Mastery">Approaching Mastery</Option>
                  <Option value="Mastery">Mastery</Option>
                </Select>
              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"How many mutation testing problems will you solve?"}
            />
            <ContractInput
              answer={contract.Mutation.problemsToSolve}
              isUpdating={isUpdating}
              element={
                <Input sx={{ width: "4em" }} placeholder="0" slotProps={{input:{type:"number", min: 0}}} value={contract.Mutation.problemsToSolve} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Mutation: { ...c.Mutation, problemsToSolve: +e.target.value },
                    }))
                  }
                />
              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"Give a qualitative description of what your code will look like in order to achieve your desired grade."}
            />
            <ContractInput 
              answer={contract.Mutation.codeDescription}
              isUpdating={isUpdating}
              element={
                <Input placeholder="Enter your answer..." value={contract.Mutation.codeDescription} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Mutation: { ...c.Mutation, codeDescription: e.target.value },
                    }))
                  }
                />
              }
            />
          </Box>

          <Box sx={rowStyle}>
            <ContractQuestion
              question={"How many reflections will you do in order to reach your desired grade and how in depth will you go with them?"}
            />
            <ContractInput 
              answer={contract.Mutation.reflectionPlan}
              isUpdating={isUpdating}
              element={
                <Input placeholder="Enter your answer..." value={contract.Mutation.reflectionPlan} 
                  onChange={(e) =>
                    setContract((c) => ({
                      ...c,
                      Mutation: { ...c.Mutation, reflectionPlan: e.target.value },
                    }))
                  }
                />
              }
            />
          </Box>
        </Box>
      )}

      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
        {
          !isUpdating ?
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
          : <></>
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
    </Box>
  )
}

function ContractQuestion({ question }: { question: string }) {
  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: "#FFEB9A",
        padding: "10px",
        borderRadius: "10px",
        width: "45%"
      }}
    >
      <Typography>{question}</Typography>
    </Box>
  )
}

function ContractInput({ isUpdating, answer, element }: { isUpdating: boolean, answer: string | number, element: ReactNode }){
  return (
    <Box 
      sx={{
        maxWidth: "45%",
        padding: "10px"
      }}
    >
    {
      isUpdating ?
        element
      : <Typography><strong>{answer}</strong></Typography>
    }
    </Box>
  )
}
