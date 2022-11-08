export class UpdateBlog {
    name
    youtubeUrl
    constructor(name: string, youtubeUrl: string) {
        this.name = name,
        this.youtubeUrl = youtubeUrl
    }
}

export class CreateBlog extends UpdateBlog {
    createdAt
    constructor(name: string, youtubeUrl: string) {
        super(name, youtubeUrl)
        this.createdAt = new Date().toISOString()
    }
}