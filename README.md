The application contains:
Landing page
Login page
Signup page
Homepage
Search
Upload/create page
User profile page

The users and videos are stored on cloud using Appwrite.
appwrite.js contains all the logic that connects the app to the cloud backend

There may be limitations when testing features due to free tier of the cloud account such as file upload size limit,
too many login attempts may block further attempts for an hour, bandwidth limit might be reached, and other things like that.

If the application does not work due to cloud problems, a new cloud account may be created to test the features
Steps are as follows:
Create Appwrite account
create project
create database
create two tables:
users table/collection which contains following attributes:
username type string, email type email, avatar type url, accountId type string.
videos table/collection which contains following attributes:
title type string, thumbnail type url, prompt type string, video type url, creator relationship that links with users
create one storage bucket
add file extensions to it depending on what type of files you want to upload
modify permissions as you wish
copy keys from each of these to the appwrite.js and replace existing values

the steps above are in case the cloud used in the code does not work, but it should work, not too much bandwidth was used, it was only used for testing



 
