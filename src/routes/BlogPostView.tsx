import { useLoaderData } from "react-router-dom";
import getBlogPosts from "../utils/getBlogPosts";
import { BlogPost } from "../types";

export async function blogPostLoader({ params }: any): Promise<BlogPost> {
    const blogPosts = getBlogPosts();
    const selected = (blogPosts as BlogPost[]).filter((b) => b.blog_id === params.blogId);
    if (selected.length !== 1) throw new Error("You tried accessing a blog post that does not exist.");
    return selected[0];
}

export default function BlogPostView() {
    const result = useLoaderData() as BlogPost
    return (<p>{result.blog_text}</p>);
}