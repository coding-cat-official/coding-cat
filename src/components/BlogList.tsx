import { List, ListItemButton, Stack, Tab, TabList, TabPanel, Tabs, Typography } from "@mui/joy";
import { Link } from "react-router-dom";
import { BlogPost } from "../types";
import { capitalizeString } from "../utils/capitalizeString";
import { useEffect, useRef } from "react";
import getBlogCategory from "../utils/blogs/getBlogCategory";

interface BlogListItemProps {
  blog: BlogPost;
  activeBlog: string | null;
  closeDrawer: () => void;
  kbSelectedBlog: string | null;
}

interface BlogListProps {
  searchedBlogs: BlogPost[];
  selectedTab: string;
  setSelectedTab: (peep: string) => void;
  selectedCategory: string | null;
  activeBlog: string | null;
  closeDrawer: () => void;
  kbSelectedBlog: string | null;
}

function BlogListItem({ blog, activeBlog, closeDrawer, kbSelectedBlog }: BlogListItemProps) {
  const itemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (blog.meta.blog_slug === kbSelectedBlog) {
      itemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [kbSelectedBlog, blog.meta.blog_slug]);

  return (
    <ListItemButton
      ref={itemRef}
      className="problems"
      key={blog.meta.blog_slug}
      selected={blog.meta.blog_slug === activeBlog}
      component={Link}
      to={`/blogs/${blog.meta.blog_slug}`}
      onClick={closeDrawer}
      sx={{
        ...(blog.meta.blog_slug === kbSelectedBlog && { backgroundColor: '#FFE293 !important' })
      }}
    >
      <Stack width="100%" direction="row" justifyContent="space-between">
        <Typography sx={{ fontFamily: "Victor Mono" }}>{blog.meta.title}</Typography>
      </Stack>
    </ListItemButton>
  );
}

export default function BlogList({
  searchedBlogs,
  selectedTab,
  setSelectedTab,
  selectedCategory,
  activeBlog,
  closeDrawer,
  kbSelectedBlog
}: BlogListProps) {
  const handleTabChange = (_: any, newValue: any) => {
    if (newValue != null) {
      setSelectedTab(newValue);
    }
  }

  const blogsByCategory = searchedBlogs.reduce<Record<string, BlogPost[]>>((acc, blog) => {
    const problemCategories = getBlogCategory(blog);
    if (!acc[problemCategories]) acc[problemCategories] = [];
    acc[problemCategories].push(blog);
    return acc;
  }, {});

  return (
    <Stack gap={1} className="stack-problemList">
      <Typography level="h1" sx={{ fontFamily: '"Press Start 2P"', fontWeight: "100", fontSize: "20pt" }}>
        {selectedCategory ? capitalizeString(selectedCategory) : ""}
      </Typography>
      <List component="nav">
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <TabList>
            {Object.keys(blogsByCategory)
              .sort()
              .filter(Boolean)
              .map((type) => (
                <Tab
                  key={type}
                  value={type}
                  variant="plain"
                  color="neutral"
                  sx={{ fontFamily: "Silkscreen" }}
                >
                  {type}
                </Tab>
              ))}
          </TabList>

          <Stack
            pl={1}
            pt={1}
            pb={1}
            width="100%"
            direction="row"
            gap={2}
            alignItems="center"
            className="sort-parent"
          >
            <Typography fontFamily="Victor Mono">
              {blogsByCategory[selectedTab].length} blog{searchedBlogs.length !== 1 ? "s" : ""} found
            </Typography>
          </Stack>
          <TabPanel className="problemList-list" value={selectedTab} sx={{ overflowY: 'auto', height: "60vh", pt: 0 }}>
            <List sx={{ pt: 0 }}>
              {blogsByCategory[selectedTab].map((blog: BlogPost) => {
                return (<BlogListItem
                  key={blog.meta.blog_slug}
                  blog={blog}
                  activeBlog={activeBlog}
                  closeDrawer={closeDrawer}
                  kbSelectedBlog={kbSelectedBlog}
                />)
              })}
            </List>
          </TabPanel>
        </Tabs>
      </List>
    </Stack>
  );
}