import { BlogPost } from "../../types.js";

/**
 * This fetches the blog post data and transforms them into BlogPost objects
 */
export default async function getBlogPosts() {
    try {
        const unsortedPosts = (await import(`../../blog-posts/blogs.js`)).default as BlogPost[];
        unsortedPosts.sort((post1: BlogPost, post2: BlogPost) => {
            //handling empty "order" values
            if (!post1.meta.order) {
                if (post2.meta.order) return -1;
                if (post1.meta.category > post2.meta.category) return 1;
                if (post1.meta.category < post2.meta.category) return -1;
                return 0;
            }
            if (!post2.meta.order) return 0;
            //handling sorting
            if (post1.meta.order!! < post2.meta.order!!) return -1
            if (post1.meta.order!! > post2.meta.order!!) return 1
            return 0;
        });
        return unsortedPosts;
    } catch (error) {
        console.log('It seems like the blogs.js file is not built. Make sure your submodules are properly set up an you ran the command "npm run build-blogs".')
        return [];
    }
}