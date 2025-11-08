# 2IDRJA React Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Rails backend server running (see `2idrja_rails_server` repository)

### Installation Steps

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd 2idrja_react_client
   npm install
   ```

2. **Environment Configuration:**
   - The `.env` file is included in the repository
   - Verify it contains:
     - `REACT_APP_STRIPE_PUBLISHABLE_KEY` (for payment processing)
   - If your backend runs on a different URL/port, you'll need to update hardcoded `localhost:3000` URLs in the codebase

3. **Start the Rails backend server:**
   - Navigate to `2idrja_rails_server` directory
   - Start the Rails server (default: `http://localhost:3000`)

4. **Start the React development server:**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3001](http://localhost:3001) (or next available port)

### Important Notes

- **Backend Dependency:** This frontend requires the Rails backend to be running on `http://localhost:3000`
- **Image Uploads:** Image upload functionality requires the backend API to be properly configured
- **Stripe Payments:** Ensure `REACT_APP_STRIPE_PUBLISHABLE_KEY` is set in `.env` for payment processing
- **Authentication:** Uses sessionStorage for auth tokens (`auth_token` or `token`)

### Features Added in admindash01 Branch

- Course enrollment status checking on home page
- Glass/frosted effect for enrolled courses
- "Completed course" indicator in dashboard
- Real-time enrollment status updates
- Disabled enroll button for already enrolled courses

---

# Getting Started with Create React App

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
