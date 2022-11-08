export class Post {
    title
    shortDescription
    content
    blogId
    constructor(title: string, shortDescription: string, content: string, blogId: string) {
        this.title = title,
        this.shortDescription = shortDescription
        this.content = content
        this.blogId = blogId
    }
}