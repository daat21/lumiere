'use server'

import {z} from 'zod'
import { cookies } from 'next/headers'

const reviewSchema = z.object({
    comment:z.string().min(1, {message:"Review cannot be empty!"}),
    rating:z.number(),
    movieId:z.string(),
})

export type ReviewFormState = 
    | {
        errors?:{
            comment?: string[]
            rating?: string[]
            movieId?: string[]
        }
        success?:boolean
        message?:string
        code?: number
    }
    | undefined


export const postReview = async ( previousState: ReviewFormState, formData: FormData): Promise<ReviewFormState> =>{
    const parsedReviewData = reviewSchema.safeParse({
        comment: formData.get('comment'),
        rating: parseFloat(formData.get('rating') as string),
        movieId: formData.get('movieId'),
    })

    if (!parsedReviewData.success){
        return{
            errors: parsedReviewData.error.flatten().fieldErrors,
            code: 400
        }
    }
    

    const {movieId,comment,rating}= parsedReviewData.data
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token') 
    if(!accessToken){
        return{
            success: false,
            message: "User is not logged in!",
            code: 401,
        }
    }
    const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/${movieId}/reviews`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
      },
      body: JSON.stringify({comment,rating}),
    }    
    )
    const data = await res.json()

    if (res.ok){
        return{
            success: true,
            message: data.message || 'Review is posted!',
            code:200
        }
    }
    else{
        return{
            success: false,
            message: data.detail || 'Failure while posting review...',
            code:400
        }
    }
}