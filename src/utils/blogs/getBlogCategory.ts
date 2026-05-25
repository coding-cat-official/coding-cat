import { BlogPost } from "../../types"
// For blog post category separation
export default function categorizeCategories(blog: BlogPost) {
    const category = blog.meta.category;
    if (category.startsWith("meta")) {
        return "Meta";
    }
    if (category.startsWith("technical")) {
        return "Technical";
    }
    return category;
}