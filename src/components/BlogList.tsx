import { List, ListItemButton, Stack, TabPanel, Tabs, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { BlogPost } from "../types";
import { capitalizeString } from "../utils/capitalizeString";


export interface BlogListProps {
    searchedBlogs: BlogPost[];
    selectedTab: string;
    setSelectedTab: (peep: string) => void;
    selectedCategory: string | null;
    activeBlog: string | null;
    closeDrawer: () => void;
}

export default function BlogList({
    searchedBlogs,
    selectedTab,
    setSelectedTab,
    selectedCategory,
    activeBlog,
    closeDrawer,
}: BlogListProps) {


    const handleTabChange = (_: any, newValue: any) => {
        if (newValue != null) {
            setSelectedTab(newValue);
        }
    }

    return (
        <Stack gap={1} className="stack-problemList">

            <Typography level="h1" sx={{ fontFamily: '"Press Start 2P"', fontWeight: "100", fontSize: "20pt" }}>
                {selectedCategory ? capitalizeString(selectedCategory) : ""}
            </Typography>
            <List component="nav">
                <Tabs value={selectedTab} onChange={handleTabChange}>
                    <TabPanel className="problemList-list" value={selectedTab} sx={{ overflowY: 'auto', height: "60vh", pt: 0 }}>
                        <List sx={{ pt: 0 }}>
                            {searchedBlogs?.map((b) =>
                                <ListItemButton className="problems" key={b.meta.blog_slug} selected={b.meta.blog_slug === activeBlog}
                                    component={Link} to={`/blogs/${b.meta.blog_slug}`} onClick={closeDrawer}>
                                    <Stack width="100%" direction="row" justifyContent="space-between">
                                        <Typography sx={{ fontFamily: "Victor Mono" }}>{b.meta.title}</Typography>
                                    </Stack>
                                </ListItemButton>,
                            )}
                        </List>
                    </TabPanel>
                </Tabs>
            </List>
        </Stack>
    );
}