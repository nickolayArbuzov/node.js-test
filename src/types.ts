export type PostType = {
        id?: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string,
        blogName: string,
        createdAt: string,
}

export type BlogType = {
        id?: string,
        name: string,
        description: string,
        websiteUrl: string,
        createdAt: string,
}

export type UserInputType = {
        id?: string,
        login: string,
        passwordHash: string,
        passwordSalt: string,
        email: string,
        isActivated: boolean,
        code: string,
        createdAt: string,
}

export type UserViewType = {
        id?: string,
        login: string,
        email: string,
        createdAt: string,
}

export type CommentType = {
        id?: string,
        content: string,
        userId: string,
        userLogin: string,
        postId: string,
        createdAt: string,
}
