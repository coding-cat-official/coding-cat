/**
 * This fetches the blog post data and transforms them into BlogPost objects
 */
export default async function getBlogPosts() {
    try {
        return (await import(`../blog-posts/blogs.js`)).default;
    } catch (error) {
        console.log('It seems like the blogs.js file is not built. Make sure your submodules are properly set up an you ran the command "npm run build-blogs".')
        return [];
    }
}