
## Description
This is a forum website based on [Firebase](https://firebase.google.com/) and React. 

Main page             |  Post
:-------------------------:|:-------------------------:
<img src="https://github.com/aless80/Firebase-React-Forum/blob/master/img/PostList.png" alt="drawing" width="300"/>  |  <img src="https://github.com/aless80/Firebase-React-Forum/blob/master/img/Post.png" alt="drawing" width="300"/>


## Set up
Create an account in Firebase with a database. Set up a Database. Find the configuration and place it in a src/Firebase.js file that you create from template:
```cp src/Firebase_example.js src/Firebase.js```

## Data structure in Firebase
```
post: {
  "AA4aQdp_post_key": {
    author: "Alessandro Marin",
    comments: 2,
    lastEdit: March 7, 2019 at 10:41:46 AM UTC+1,
    profilePicUrl: "https://lh3.googleusercontent.com/-71tkp-VXGdM/AAAAAAAAAAI/AAAAAAAAUAA/w5B0IQGGPUQ/photo.jpg",
    plainText: "This is the text in the post",
    status: "open",
    timestamp: March 7, 2019 at 10:41:46 AM UTC+1,
    title: "Title of my post"
  },
  "BB5bQhf_post_key": {
    ...
  }
}

comments: {
  "AA4aQdp_post_key": {
    "MM18sh1_msg_key": {
      author: "John Doe",
      lastEdit: March 8, 2019 at 12:00:00 AM UTC+1,
      plainText: "This is the first comment in the post",
      profilePicUrl: "https://lh3.googleusercontent.com/-62rjo-VXGdM/BBBBBBBBBBI/BBBBBBBBBUBB/w6C1UYEGOUY/photo.jpg",
      richText: "<p>This is the first comment in the post</p>",
      timestamp: March 8, 2019 at 12:00:00 AM UTC+1,
    },
    "NN29yt2_msg_key": {
      author: "Alessandro Marin",
      lastEdit: March 8, 2019 at 12:00:00 AM UTC+1,
      plainText: "This is the 2nd comment in the post",
      profilePicUrl: "https://lh3.googleusercontent.com/-71tkp-VXGdM/AAAAAAAAAAI/AAAAAAAAUAA/w5B0IQGGPUQ/photo.jpg",
      richText: "<p>This is <strong>the 2nd</strong> comment in the post</p>,      
      timestamp: March 8, 2019 at 12:00:00 AM UTC+1,
    }
  },
  "BB5bQhf_post_key": {
    ..
  }
}
```
<!--

## Todo
* emojis in TextEditor
* focus on texteditor in Reply component
* JSDoc http://usejsdoc.org/about-getting-started.htm
* firebase storage and upload images from TextEditor
* paging for Post
* propTypes - skip?
* add categories to posts?
-->

# Instructions Generated by React's create react-app command

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
