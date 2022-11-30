import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { LikeType, UserViewType } from "../types";
import { likesCollection } from "./db";

@injectable()
export class LikesRepo {

    async like(user: UserViewType, likeStatus: string, postId: string | null, commentId: string | null) {

        const likePosition = await likesCollection.findOne({userId: user.id, postId: postId ? postId : null, commentId : commentId ? commentId : null})
        if(likePosition) {
            if(likeStatus === 'None') {
                await likesCollection.deleteOne({userId: user.id, postId: postId ? postId : null, commentId : commentId ? commentId : null})
            }
            if(likeStatus !== likePosition.status) {
                await likesCollection.updateOne({userId: user.id, postId: postId ? postId : null, commentId : commentId ? commentId : null}, {$set: {status: likeStatus}})
            }
        } 
        if(!likePosition && likeStatus !== 'None') {
            await likesCollection.insertOne({
                userId: user.id!,
                login: user.login,
                postId: postId,
                commentId: commentId,
                addedAt: new Date().toISOString(),
                status: likeStatus,
            })
        }
        
        return true
    }

    async getLikesInfoForComment(commentId: string, userId: string) {
        const likeInfo = await likesCollection.find({commentId: commentId}).toArray()
        return {
            dislikesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Dislike').length,
            likesCount: likeInfo.filter(li => li.commentId === commentId && li.status === 'Like').length, 
            myStatus: likeInfo.find(li => li.commentId === commentId && li.userId === userId) ? likeInfo.find(li => li.commentId === commentId && li.userId === userId)?.status : 'None',
        }
    }

    async getLikesInfoForPost(postId: string, userId: string) {
        const likeInfo = await likesCollection.find({postId: postId}).toArray()
        console.log('likeInfo', likeInfo)
        return {
            dislikesCount: likeInfo.filter(li => li.postId === postId && li.status === 'Dislike').length,
            likesCount: likeInfo.filter(li => li.postId === postId && li.status === 'Like').length, 
            myStatus: likeInfo.find(li => li.postId === postId && li.userId === userId) ? likeInfo.find(li => li.postId === postId && li.userId === userId)?.status : 'None',
            newestLikes: [...likeInfo.filter(l => l.status === 'Like').sort((a, b) => a.addedAt > b.addedAt ? -1 : 1).slice(0, 3).map(l => {
                return {addedAt: l.addedAt, userId: l.userId, login: l.login}
            })]
        }
    }

}