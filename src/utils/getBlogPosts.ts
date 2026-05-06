/**
 * This fetches the blog post data and transforms them into BlogPost objects
 */
export default async function getBlogPosts() {
    return (await import(`../blogs/blogs.js`)).default;
}