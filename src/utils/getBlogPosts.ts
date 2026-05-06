/**
 * This fetches the blog post data and transforms them into BlogPost objects
 */
export default function getBlogPosts() {
    return [
        {
            meta: {
                author: 'Test',
                title: 'Test blog 123',
                blog_id: '123'
            },
            blog_text: 'Hi, `testing code format`, **testing bold format**, and also *testing italics format*.',
        },
        {
            meta: {
                author: 'Test #2',
                title: 'Another blog',
                blog_id: '124'
            },
            blog_text: '<h2>This should be a header</h2>\n<ol><li style="color: red;">List elem 1 (red)</li><li style="color: blue;">List elem 2 (blue)</li></ol>',
        },
        {
            meta: {
                author: 'Test #3',
                title: 'The blog after that',
                blog_id: '125'
            },
            blog_text: '# This is a header\n* testing bullet point lists\n* more bullets\n* I need more bullets',
        }
    ];
}