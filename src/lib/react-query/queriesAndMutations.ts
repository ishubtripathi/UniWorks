import {
    // useQuery,
    // useQueryClient,
    // useInfiniteQuery,
    useMutation,
} from '@tanstack/react-query'
import { INewUser } from '../../types'
import { createUserAccount, signInAccount } from '../appwrite/api'

// for creating new user
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

// for signing in user
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string; 
            password: string;
        }) => signInAccount(user)
    })
}