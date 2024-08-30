import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { INewPost, INewUser } from '../../types';
import { createUserAccount, signInAccount, signOutAccount, createPost, getRecentPosts } from '../appwrite/api'; // Ensure this is the correct function for post creation
import { QUERY_KEYS } from './queryKeys';  

// For creating a new user
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    });
};

// For signing in a user
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) => signInAccount(user),
    });
};
 
// For signing out
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

// For creating a post
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            })
        }
    })
}

export const useGetRecentPosts = () =>  {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}