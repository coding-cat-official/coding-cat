import { Dispatch, ReactNode, SetStateAction } from "react";
import { ContractData } from "../../../types";
import { Box, Input, Option, Select, Stack, Table, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

interface ContractEditProps {
  contract: ContractData;
  setContract: Dispatch<SetStateAction<ContractData>>;
  isUpdating: boolean;
  featureMap: Record<string,boolean>;
  problemCountByCategory: Record<string, number>;
}

export default function ContractEdit({ contract, setContract, isUpdating, featureMap, problemCountByCategory }: ContractEditProps) {
  const allCategories = Object.keys(contract.Coding.problemsToSolveByCategory);

  var displayedCategories: string[] = [];
  allCategories.forEach((c) => {
    if(c === "haystack" && !featureMap["Haystack"]){
      return;
    }
    else if(c === "mutation" && !featureMap["Mutation"]){
      return;
    }
    else if(!featureMap["CodingStage2"]){
      return;
    }
    displayedCategories.push(c);
  });

  const rowStyle: SxProps = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: "10px",
    marginBottom: "15px",
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
    <>
    { !featureMap["CodingStage2"] && !featureMap["Haystack"] &&!featureMap["Mutation"]
      && <Typography>All feature maps are disabled. Please try again later or contact Eric.</Typography> }
    
    <Box sx={{ display: "flex", flexDirection: "column", overflowY: "scroll" }}>
      
      { /* Coding Questions ("CodingStage2") */ }
      { featureMap["CodingStage2"] && <Box sx={sectionStyle}>
        <Typography level="h3">Coding</Typography>

        <Box sx={rowStyle}>
          <ContractQuestion 
            question={"What grade do you want to get?"}
          />
          <ContractInput
            answer={contract.Coding.gradeWanted ?? "Not answered"}
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

        {
          displayedCategories.length > 0 ?
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "row", 
              flexWrap: "wrap", 
              margin: "10px", 
              marginLeft: "0px", 
              marginBottom: "15px"
            }}
          >
            <ContractQuestion question={"How many problems of each category will you solve?"} />
            <ContractCategoriesInput 
              isUpdating={isUpdating}
              categories={displayedCategories}
              problemCountByCategory={problemCountByCategory}
              contract={contract}
              setContract={setContract}
            />
          </Box>
          : <></>
        }
        
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
      </Box> }

      { /* Haystack Questions */ }
      { featureMap["Haystack"] && <Box sx={sectionStyle}>
        <Typography level="h3">Haystack</Typography>
        
        <Box sx={rowStyle}>
          <ContractQuestion
            question={"What grade do you want to get?"}
          />
          <ContractInput
            answer={contract.Haystack.gradeWanted ?? "Not answered"}
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
      </Box> }

      { /* Mutation Questions */ }
      { featureMap["Mutation"] && <Box sx={sectionStyle}>
        <Typography level="h3">Mutation Testing</Typography>
        
        <Box sx={rowStyle}>
          <ContractQuestion
            question={"What grade do you want to get?"}
          />
          <ContractInput
            answer={contract.Mutation.gradeWanted ?? "Not answered"}
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
      </Box> }
    </Box>
    </>
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
        width: "100%"
      }}
    >
      <Typography><strong>{question}</strong></Typography>
    </Box>
  )
}

function ContractInput({ isUpdating, answer, element }: { isUpdating: boolean, answer: string | number, element: ReactNode }){
  return (
    <>
    {
      isUpdating ?
      <Box 
        sx={{
          display: "flex",
          padding: "10px",
          width: "100%",
          marginLeft: "10px"
        }}
      >
        {element}
      </Box>
      : <Box 
        sx={{
          display: "flex",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "10px",
          marginLeft: "10px",
          width: "100%"
        }}
      >
        <Typography>{answer !== "" ? answer : "Not answered"}</Typography>
      </Box>
    }
    </>
  )
}

function ContractCategoriesInput({ isUpdating, categories, problemCountByCategory, contract, setContract }: { isUpdating: boolean, categories: string[], problemCountByCategory: Record<string,number>, contract: ContractData, setContract: Dispatch<SetStateAction<ContractData>> }){
  return (
    <Table 
      sx={{ 
        display: "flex",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        marginTop: "10px"
      }}
    >
      <tr>
      {
        categories.map((c) => {
          return (
            <td style={{ display: "inline-block" }}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography>{c}: </Typography>
                {
                  isUpdating ?
                    <Input
                      variant="plain"
                      size="sm"
                      sx={{ width: "50px", typography: 'body1', backgroundColor: "whitesmoke" }}
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
  )
}
