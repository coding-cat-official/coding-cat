import React from 'react';
import { Drawer, ModalClose, DialogTitle, DialogContent, Select, Option, Stack, Box, Button } from '@mui/joy';
import CategoryList from '../CategoryList';
import CustomSearch from '../ProblemSearch';
import ProblemList from '../ProblemList';
import BlogList from '../BlogList';
import PasswordProtected from '../../routes/PasswordProtected';
import { Problem, BlogPost } from '../../types';

interface Props {
  drawerOpen: boolean;
  onDrawerClose: () => void;
  openCategory: boolean;
  setOpenCategory: React.Dispatch<React.SetStateAction<boolean>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  searchedProblems: Problem[];
  searchedBlogs: BlogPost[];
  activeCategory: string | null;
  handleSelectedCategory: (cat: string) => void;
  problemListProps: any;
  blogListProps: any;
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  keyboardSelected: string | null;
}

export default function SidebarDrawer({
  drawerOpen,
  onDrawerClose,
  openCategory,
  setOpenCategory,
  difficulty,
  setDifficulty,
  query,
  setQuery,
  searchedProblems,
  searchedBlogs,
  activeCategory,
  handleSelectedCategory,
  problemListProps,
  blogListProps,
  selectedTab,
  setSelectedTab,
  keyboardSelected
}: Props) {
  return (
    <Drawer open={drawerOpen} onClose={onDrawerClose} size="lg" 
      // Temporary fix for: https://github.com/coding-cat-official/coding-cat/pull/56
      sx={{ "--ModalClose-inset": "1rem", "--Drawer-verticalSize": "clamp(500px, 60%, 100%)", "--Drawer-horizontalSize": "100vw", "--Drawer-titleMargin": "1rem 1rem calc(1rem / 2)" }}
    >
      <ModalClose />
      <Stack width="100%" direction="row" justifyContent="space-between" padding={'10px'} className="big-navbar" sx={{ alignItems: 'center' }}>
        <DialogTitle level="h1" sx={{ fontFamily: '"Silkscreen", monospace', padding: '5px', fontSize: '30pt' }}>
          Coding Cat
        </DialogTitle>
        <Stack marginRight="5em" direction="row" gap={3} className="problemList-search-filter">
          <Select sx={{ width: '150px', fontWeight: 'normal', fontFamily: 'Silkscreen' }} placeholder="Difficulty" value={difficulty} onChange={(e, newValue) => setDifficulty(newValue || '')}>
            <Option sx={{ fontFamily: 'Silkscreen' }} value="all">All</Option>
            <Option sx={{ fontFamily: 'Silkscreen' }} value="easy">Easy</Option>
            <Option sx={{ fontFamily: 'Silkscreen' }} value="medium">Medium</Option>
            <Option sx={{ fontFamily: 'Silkscreen' }} value="hard">Hard</Option>
          </Select>
          <CustomSearch query={query} setQuery={setQuery} placeholder="Search for exercises..." />
        </Stack>
      </Stack>
      <DialogContent>
        <Box sx={{ display: 'flex', overflow: 'hidden', gap: '16px' }}>
          <Button className="mobile-categoryList" onClick={() => setOpenCategory(true)}>&gt;</Button>
          <Drawer open={openCategory} onClose={() => setOpenCategory(false)} sx={{ flex: 1, width: 300, overflowY: 'auto' }} className="mobile-categoryList">
            <CategoryList 
              searchedProblems={searchedProblems} 
              activeCategory={activeCategory} 
              onSelectCategory={handleSelectedCategory} 
              session={problemListProps.session} 
              contractProgress={problemListProps.contractProgress}
              keyboardSelected={keyboardSelected}
            />
          </Drawer>

          <Box sx={{ flex: 1, width: 300, overflowY: 'auto' }} className="categoryList">
            <CategoryList 
              searchedProblems={searchedProblems} 
              activeCategory={activeCategory} 
              onSelectCategory={handleSelectedCategory} 
              session={problemListProps.session} 
              contractProgress={problemListProps.contractProgress} 
              keyboardSelected={keyboardSelected} 
            />
          </Box>

          <Box sx={{ flex: 3 }} className="parent-problemList">
            {activeCategory === 'test-questions' ? (
              <PasswordProtected {...problemListProps} />
            ) : activeCategory === 'blogs' ? (
              <BlogList {...blogListProps} />
            ) : (
              <ProblemList {...problemListProps} />
            )}
          </Box>
        </Box>
      </DialogContent>
    </Drawer>
  );
}
