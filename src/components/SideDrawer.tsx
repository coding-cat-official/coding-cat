import { Box, Stack, Drawer, ModalClose, DialogTitle, DialogContent, Button, Option, Select } from '@mui/joy';
import CustomSearch from '../components/ProblemSearch';
import { useState } from 'react';
import CategoryList from './CategoryList';
import { useLoaderData } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { BLANK_CONTRACT, ContractData, ContractProgress, Problem, Submission } from '../types';
import ProblemList from './ProblemList';

export interface SideDrawerProps {

}

export default function SideDrawer({ qry }: any) {

    const [session, setSession] = useState<Session | null>(null);
    const [isRecoverySession, setIsRecoverySession] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeSession, setActiveSession] = useState(false);
    const [open, setOpen] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);
    const [activeProblem, setActiveProblem] = useState<null | string>(null);
    const problems = useLoaderData() as Problem[];
    const [activeCategory, setActiveCategory] = useState<string | null>(() => { return 'Fundamentals'; });
    const [query, setQuery] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [searchedProblems, setSearchedProblems] = useState<Problem[]>([]);
    const [selectedTab, setSelectedTab] = useState("");
    const [contract, setContract] = useState<ContractData>(BLANK_CONTRACT);
    const [progress, setProgress] = useState<Submission[]>([]);


    const contractProgress: ContractProgress = contract.Coding.problemsToSolveByCategory;
    contractProgress["mutation"] = contract.Mutation.problemsToSolve;
    contractProgress["haystack"] = contract.Haystack.problemsToSolve;

    let newDifficulty = difficulty;
    if (newDifficulty === "all") newDifficulty = "";

    function handleSelectedCategory(category: string) {
        setActiveCategory(category)
        setActiveProblem(null)
        setOpenCategory(false)
        if (category === "coding") setSelectedTab("")
        else setSelectedTab("List")
    }

    function handleSelectedProblem(name: string) {
        setActiveProblem(name)
        setOpen(false)
    }

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            size="lg"
            // Temporary fix for: https://github.com/coding-cat-official/coding-cat/pull/56
            sx={{
                "--ModalClose-inset": "1rem",
                "--Drawer-verticalSize": "clamp(500px, 60%, 100%)",
                "--Drawer-horizontalSize": "100vw",
                "--Drawer-titleMargin": "1rem 1rem calc(1rem / 2)",
            }}
        >
            <ModalClose />
            <Stack width="100%" direction="row" justifyContent="space-between" padding={'10px'} className="big-navbar" sx={{ alignItems: "center" }}>
                <DialogTitle level='h1' sx={{ fontFamily: '"Silkscreen", monospace', padding: "5px", fontSize: "30pt" }}>
                    Coding Cat
                </DialogTitle>
                <Stack marginRight="5em" direction="row" gap={3} className="problemList-search-filter">
                    <Select sx={{ width: "150px", fontWeight: "normal", fontFamily: "Silkscreen" }} placeholder="Difficulty" value={difficulty} onChange={(e, newValue) => setDifficulty(newValue || "")}>
                        <Option sx={{ fontFamily: "Silkscreen" }} value="all">All</Option>
                        <Option sx={{ fontFamily: "Silkscreen" }} value="easy">Easy</Option>
                        <Option sx={{ fontFamily: "Silkscreen" }} value="medium">Medium</Option>
                        <Option sx={{ fontFamily: "Silkscreen" }} value="hard">Hard</Option>
                    </Select>
                    <CustomSearch query={query} setQuery={setQuery} placeholder="Search for exercises..." />
                </Stack>
            </Stack>
            <DialogContent>
                <Box sx={{ display: 'flex', overflow: 'hidden', gap: "16px" }}>
                    <Button className="mobile-categoryList" onClick={() => setOpenCategory(true)}>&gt;</Button>
                    <Drawer open={openCategory} onClose={() => setOpenCategory(false)} sx={{ flex: 1, width: 300, overflowY: 'auto', }} className="mobile-categoryList">
                        <CategoryList
                            searchedProblems={searchedProblems}
                            activeCategory={activeCategory}
                            onSelectCategory={handleSelectedCategory}
                            session={session}
                            contractProgress={contractProgress}
                        />
                    </Drawer>
                    <Box sx={{ flex: 1, width: 300, overflowY: 'auto', }} className="categoryList">
                        <CategoryList
                            searchedProblems={searchedProblems}
                            activeCategory={activeCategory}
                            onSelectCategory={handleSelectedCategory}
                            session={session}
                            contractProgress={contractProgress}
                        />
                    </Box>
                    <Box sx={{ flex: 3 }} className="parent-problemList">
                        <ProblemList
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            searchedProblems={searchedProblems}
                            selectedCategory={activeCategory}
                            activeProblem={activeProblem}
                            onSelectProblem={handleSelectedProblem}
                            closeDrawer={() => setOpen(false)}
                            session={session}
                            contractProgress={contractProgress}
                            progress={progress}
                        />
                    </Box>
                </Box>
            </DialogContent>
        </Drawer>
    );
}