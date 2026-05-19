import { useLoaderData, useNavigate } from "react-router-dom";
import getBlogPosts from "../utils/getBlogPosts";
import { BlogPost } from "../types";
import Markdown from "markdown-to-jsx";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { useCallback, useEffect, useState } from "react";

export async function blogPostLoader({ params }: any): Promise<BlogPost> {
  const blogPosts = await getBlogPosts();
  const selected = (blogPosts as BlogPost[]).filter((b) => b.meta.blog_slug === params.blogId);
  if (selected.length !== 1) throw new Error("You tried accessing a blog post that does not exist.");
  return selected[0];
}

export default function BlogPostView() {
  const result = useLoaderData() as BlogPost;
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [currIndex, setCurrIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setAllBlogs(await getBlogPosts());
    })();
  }, []);

  useEffect(() => {
    setCurrIndex(allBlogs.findIndex(p => p.meta.blog_slug === result.meta.blog_slug));
  }, [allBlogs, result.meta.blog_slug]);

  function handlePreviousBlog() {
    if (currIndex > 0) {
      const prevBlog = allBlogs[currIndex - 1].meta.blog_slug;
      setCurrIndex(currIndex - 1);
      navigate(`/blogs/${prevBlog}`)
    }
  }

  function handleNextBlog() {
    if (currIndex < allBlogs.length - 1) {
      const nextBlog = allBlogs[currIndex + 1].meta.blog_slug;
      setCurrIndex(currIndex + 1);
      navigate(`/blogs/${nextBlog}`)
    }
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if(event.altKey && event.key === "ArrowLeft"){
      event.preventDefault();
      handlePreviousBlog();
    }

    if(event.altKey && event.key === "ArrowRight"){
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
        <Box className="navigate-problem-btn">
          <Button disabled={currIndex === 0} onClick={handlePreviousBlog}>
            <Stack direction="column" spacing={0} alignItems="center">
              <Typography level="body-md" fontFamily="inherit">Prev</Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                (Alt + ←)
              </Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                {allBlogs[currIndex - 1]?.meta.title}
              </Typography>
            </Stack>
          </Button>
          <Button disabled={currIndex >= allBlogs.length - 1} onClick={handleNextBlog}>
            <Stack direction="column" spacing={0} alignItems="center">
              <Typography level="body-md" fontFamily="inherit">Next</Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                (Alt + →)
              </Typography>
              <Typography level="body-sm" fontStyle="italic" fontFamily="inherit">
                {allBlogs[currIndex + 1]?.meta.title}
              </Typography>
            </Stack>
          </Button>
        </Box>

        <Sheet sx={{ border: 2, borderRadius: 10, p: 2, display: "flex", flexDirection: "column", gap: 1, width: "75%" }}>
          <Box sx={{ width: "100%", flexDirection: "column", gap: 1 }}>
            <Box>
              <Typography level="h2">{result.meta.title}</Typography>
              {!!result.meta.author && <Typography level="body-sm">Authored by {result.meta.author}</Typography>}
              {!!result.meta.editor && <Typography level="body-sm">Edited by {result.meta.editor}</Typography>}
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Markdown>
                {result.blog_text}
              </Markdown>
            </Box>
          </Box>
        </Sheet>
    </Stack >
  );
}