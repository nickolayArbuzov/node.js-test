import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { LikeType, UserViewType } from "../types";
import { likesCollection, logCollection,  } from "./db";

@injectable()
export class LikesRepo {

    async like(user: UserViewType, likeStatus: string, postId: string | null, commentId: string | null) {
        await logCollection.insertOne({user: user, likeStatus: likeStatus, commentId: commentId})
        const likePosition = await likesCollection.findOne({userId: user.id, postId: postId ? postId : null, commentId : commentId ? commentId : null})
        if(likePosition) {
            //const newStatus = likePosition.status === "None" ? likeStatus : "None" 
            if(likeStatus === 'None' || likeStatus === likePosition.status) {
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

    async getLikesInfoForPost(postId: string) {
        const likeInfo = await likesCollection.find({postId: postId}).toArray()
        return likeInfo
    }

}