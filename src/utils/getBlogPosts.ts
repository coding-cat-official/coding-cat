/**
 * This fetches the blog post data and transforms them into BlogPost objects
 */
export default function getBlogPosts() {
    return [
        {
            author: 'Test',
            title: 'Test blog 123',
            blog_text: 'Hi, `testing code format`, **testing bold format**, and also *testing italics format*.',
            blog_id: '123'
        },
        {
            author: 'Test #2',
            title: 'Another blog',
            blog_text: '<h2>This should be a header</h2>\n<ol><li style="color: red;">List elem 1 (red)</li><li style="color: blue;">List elem 2 (blue)</li></ol>',
            blog_id: '124'
        },
        {
            author: 'Test #3',
            title: 'The blog after that',
            blog_text: '# This is a header\n* testing bullet point lists\n* more bullets\n* I need more bullets',
            blog_id: '125'
        }
    ];
}