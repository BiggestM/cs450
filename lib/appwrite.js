import { ID, Account, Client, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.cs450',
    projectId: '6668e4ac002963366eee',
    databaseId: '6668e62700194c7bd2ec',
    userCollectionId: '6668e652001ac2f20cc5',
    videCollectionId: '6668e707003725d36693',
    storageId: '6668e870000686ba2322'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videCollectionId,
    storageId,
} = appwriteConfig;


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await login(email, password)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl,
            }
        )
        return newUser;

    }catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export const login = async (email, password) => {
    try{
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch(error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try{
      const currentAccount = await getAccount();

      if(!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      )

      if(!currentUser) throw Error;

      return currentUser.documents[0];

    } catch (error) {
        console.log(error);
        return null;
    }
}
    
export const getAllPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId
        )

        return posts.documents;
    } catch(error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents;
    } catch(error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.search("title", query)]
        )
        if(!posts) throw new Error("Something went wrong")

        return posts.documents;
    } catch(error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try{
        const posts = await databases.listDocuments(
            databaseId,
            videCollectionId,
            [Query.equal("creator", userId)]
        )
        if(!posts) throw new Error("Something went wrong")

        return posts.documents;
    } catch(error) {
        throw new Error(error);
    }
}

export const logOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;


    try {
      if(type === "video"){
        fileUrl = storage.getFileView(storageId, fileId)
      }else if(type === 'image') {
        fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
      } else {
        throw new Error('Invalid file type')
      }

      if(!fileUrl) throw Error;

      return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if(!file) return;

    
    const asset = { 
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri

    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try{
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ])

        const newPost = await databases.createDocument(
            databaseId, videCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
}