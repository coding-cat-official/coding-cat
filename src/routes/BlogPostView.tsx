import { useLoaderData, useNavigate } from "react-router-dom";
import getBlogPosts from "../utils/blogs/getBlogPosts";
import { BlogPost } from "../types";
import Markdown from "markdown-to-jsx";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";
import { getOrderedBlogPosts } from "../utils/blogs/getOrderedBlogPosts";

export async function blogPostLoader({ params }: any): Promise<BlogPost> {
  const blogPosts = await getBlogPosts();
  const selected = (blogPosts as BlogPost[]).filter((b) => b.meta.blog_slug === params.blogId);
  if (selected.length !== 1) throw new Error("You tried accessing a blog post that does not exist.");
  return selected[0];
}

export default function BlogPostView() {
  const currBlog = useLoaderData() as BlogPost;
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [currCategoryBlogs, setCurrCategoryBlogs] = useState<BlogPost[]>([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setAllBlogs(await getBlogPosts());
    })();
  }, []);

  useEffect(() => {
    const blogs = allBlogs.filter(blog => {
      return blog.meta.category === currBlog.meta.category;
    });
    setCurrCategoryBlogs(getOrderedBlogPosts(blogs));
  }, [allBlogs, currBlog.meta.category])

  useEffect(() => {
    setCurrIndex(currCategoryBlogs.findIndex(p => p.meta.blog_slug === currBlog.meta.blog_slug));
  }, [currCategoryBlogs, currBlog.meta.blog_slug]);

  const handlePreviousBlog = useCallback(() => {
    if (currIndex > 0) {
      const prevBlog = currCategoryBlogs[currIndex - 1].meta.blog_slug;
      setCurrIndex(currIndex - 1);
      navigate(`/blogs/${prevBlog}`);
    }
  }, [navigate, currIndex, currCategoryBlogs]);

  const handleNextBlog = useCallback(() => {
    if (currIndex < currCategoryBlogs.length - 1) {
      const nextBlog = currCategoryBlogs[currIndex + 1].meta.blog_slug;
      setCurrIndex(currIndex + 1);
      navigate(`/blogs/${nextBlog}`);
    }
  }, [navigate, currIndex, currCategoryBlogs]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.altKey && event.key === "ArrowLeft") {
      event.preventDefault();
      handlePreviousBlog();
    }

    if (event.altKey && event.key === "ArrowRight") {
      event.preventDefault();
      handleNextBlog();
    }
  }, [handlePreviousBlog, handleNextBlog]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Stack sx={{ flex: 4, width: "100%", height: "100%", display: "flex" }} direction="column" spacing={2} alignItems="center" marginBottom="1rem" zIndex={-2} >
      <Box className="navigate-problem-btn" sx={{ display: "flex" }} width={"95%"} justifyContent={"space-between"}>
        <Button disabled={currIndex === 0} onClick={handlePreviousBlog}>
          <Stack direction="column" spacing={0} alignItems="center">
            <Typography level="body-md" fontFamily="inherit">Prev</Typography>
            <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
              (Alt + ←)
            </Typography>
            <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
              {currCategoryBlogs[currIndex - 1]?.meta.title}
            </Typography>
          </Stack>
        </Button>
        <Button disabled={currIndex >= currCategoryBlogs.length - 1} onClick={handleNextBlog}>
          <Stack direction="column" spacing={0} alignItems="center">
            <Typography level="body-md" fontFamily="inherit">Next</Typography>
            <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
              (Alt + →)
            </Typography>
            <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
              {currCategoryBlogs[currIndex + 1]?.meta.title}
            </Typography>
          </Stack>
        </Button>
      </Box>

      <Sheet sx={{ border: 2, borderRadius: 10, p: 2, display: "flex", flexDirection: "column", gap: 1, width: "75%" }}>
        <Box sx={{ width: "100%", flexDirection: "column", gap: 1 }}>
          <Box>
            <Typography level="h2">{currBlog.meta.title}</Typography>
            {!!currBlog.meta.author && <Typography level="body-sm">Authored by {currBlog.meta.author}</Typography>}
            {!!currBlog.meta.editor && <Typography level="body-sm">Edited by {currBlog.meta.editor}</Typography>}
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Markdown>
              {currBlog.blog_text}
            </Markdown>
          </Box>
        </Box>
      </Sheet>
    </Stack>
  );
}