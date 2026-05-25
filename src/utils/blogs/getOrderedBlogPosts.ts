import { BlogPost } from "../../types";

export function getOrderedBlogPosts(blogs: BlogPost[]) {
    blogs.sort((post1: BlogPost, post2: BlogPost) => {
        //handling empty "order" values
        if (!post1.meta.order) {
            if (post2.meta.order) return -1;
            return 0;
        }
        if (!post2.meta.order) return 1;
        //handling sorting
        if (post1.meta.order!! < post2.meta.order!!) return -1
        if (post1.meta.order!! > post2.meta.order!!) return 1
        return 0;
    });
    return blogs;
}