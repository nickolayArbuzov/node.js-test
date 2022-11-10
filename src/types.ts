export type PostType = {
        id?: string | null,
        title: string | null,
        shortDescription: string | null,
        content: string | null,
        blogId: string | null,
        blogName: string | null,
        createdAt: string,
}

export type BlogType = {
        id?: string,
        name: string,
        youtubeUrl: string,
        createdAt: string,
}

export type UserType = {
        id?: string,
        login: string,
        passwordHash: string,
        passwordSalt: string,
        email: string,
        createdAt: string,
}
