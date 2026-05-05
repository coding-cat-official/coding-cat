import { useLoaderData } from "react-router-dom";

export async function blogPostLoader({ params }: any): Promise<String> {
    return params.blogTitle;
}

export default function BlogPostView() {
    const result = useLoaderData() as String
    return (<p>{result}</p>);
}