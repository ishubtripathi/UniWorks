import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { INewPost, INewUser, IUpdatePost } from '../../types';
import { createUserAccount, signInAccount, signOutAccount } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';  
import { CreatePost } from '../../_root/pages';


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
        mutationFn: (post: INewPost) => CreatePost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};


// For updating a post
