export interface postType {
        id?: string | null,
        title: string | null,
        shortDescription: string | null,
        content: string | null,
        blogId: string | null,
        blogName: string | null,
        createdAt: string,
}

export interface blogType{
        id?: string,
        name: string,
        youtubeUrl: string,
        createdAt: string,
}
