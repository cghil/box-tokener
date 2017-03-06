# What does this tool do?
The tool can generate two different types of access tokens: 
1. access tokens scoped an service account, known as the enterprise token.
2. access tokens scoped to other users (managed user or app user).

# How to use this tool?
You will needed to have set up and application on Box. Please create your application [here](developer.box.com). Make sure to scope your application to use server side authentication. If you scope your application to only app users, your application will only be able to create platform only users. If you scope your application to use all users, you will be able to authenticate as managed and app users. All server side authenticated applications will have access to the service account.

##Generating an user access token
```
 node index.js -C CLIENT_ID -U USER_ID -K PATH_TO_PRIVATE_KEY/PRIVATE_KEY_FILE_NAME.pem -P KEY_SECRET -S CLIENT_SECRET -Q PUBLIC_KEY_ID
 ```

 ##Generating an access token to enterprise access token
 ```
 node index.js -C CLIENT_ID -E ENTERPRISE_ID -K PATH_TO_PRIVATE_KEY/PRIVATE_KEY_FILE_NAME.pem -P KEY_SECRET -S CLIENT_SECRET -Q PUBLIC_KEY_ID
 ```