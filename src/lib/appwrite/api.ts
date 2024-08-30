import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "../../types";
import { appwriteConfig, account, databases, avatars, storage } from "./config";

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Upload a file to Appwrite storage
async function uploadFile(file: File) {
  try {
    // Check if storageId is defined
    if (!appwriteConfig.storageId) {
      throw new Error("Storage bucket ID is not defined in the configuration.");
    }

    // Upload the file
    console.log("Uploading file to bucket:", appwriteConfig.storageId);
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    console.log("File uploaded successfully:", uploadedFile);
    return uploadedFile;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error uploading file:", error.message || error);
  }
}

// Get a file preview URL from Appwrite storage
function getFilePreview(fileId: string): string {
  try {
    // Check if storageId is defined
    if (!appwriteConfig.storageId) {
      throw new Error("Storage bucket ID is not defined in the configuration.");
    }

    // Generate file preview URL
    return storage.getFilePreview(appwriteConfig.storageId, fileId).toString();
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error getting file preview:", error.message || error);
    return "";
  }
}

// Delete a file from Appwrite storage
export async function deleteFile(fileId: string) {
  try {
    // Check if storageId is defined
    if (!appwriteConfig.storageId) {
      throw new Error("Storage bucket ID is not defined in the configuration.");
    }

    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error deleting file:", error.message || error);
  }
}

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Failed to create user account.");

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl.toString(),
    });

    return newUser;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error creating user account:", error.message || error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error saving user to database:", error.message || error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error signing in account:", error.message || error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error getting account:", error.message || error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw new Error("Failed to get current account.");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("Failed to get current user.");

    return currentUser.documents[0];
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error getting current user:", error.message || error);
    return null;
  }
}

// ============================== LOG OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error signing out account:", error.message || error);
  }
}

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to Appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw new Error("Failed to upload file.");

    // Get file URL
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to get file preview URL.");
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to create new post.");
    }

    return newPost;
  } catch (error: any) { // Explicitly typing error as 'any'
    console.error("Error creating post:", error.message || error);
  }
}
