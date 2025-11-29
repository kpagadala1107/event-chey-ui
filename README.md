# Event Management React Application

A production-ready React 18 web application for comprehensive event management with real-time Q&A, polling, and AI-powered summaries.

## 🚀 Features

- **Event Management**: Create, view, and manage events with detailed information
- **Agenda Management**: Organize event schedules with speakers and time slots
- **Q&A System**: Interactive question and answer sessions with upvoting
- **Live Polling**: Create polls with real-time results visualization
- **AI Summaries**: AI-generated summaries for events and agenda items
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Powered by React Query for optimal data fetching

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router v6** - Routing
- **React Query (@tanstack/react-query)** - Server state management
- **Tailwind CSS** - Styling
- **Axios** - API client
- **Formik + Yup** - Form handling and validation
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Heroicons** - Icon library
- **date-fns** - Date formatting

## 📦 Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── axiosClient.js     # Axios configuration with interceptors
│   ├── eventApi.js        # Event-related API calls
│   ├── agendaApi.js       # Agenda-related API calls
│   ├── questionApi.js     # Q&A API calls
│   └── pollApi.js         # Polling API calls
├── components/            # React components
│   ├── EventCard.jsx      # Event list card
│   ├── AgendaItemCard.jsx # Agenda item card
│   ├── QuestionItem.jsx   # Question/answer card
│   ├── PollCard.jsx       # Poll with chart visualization
│   └── UI/                # Reusable UI components
├── pages/                 # Page components
│   ├── EventsPage.jsx     # Events list and creation
│   ├── EventDetailsPage.jsx # Event details with agenda
│   └── AgendaPage.jsx     # Q&A, polls, and summaries
├── context/               # React context
│   └── AuthContext.jsx    # Authentication state
├── hooks/                 # Custom hooks
│   └── useEvent.js        # Event-related queries
├── App.js                 # Main app component with routing
└── index.js               # Entry point
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, minimalistic interface with soft shadows
- **Responsive Layout**: Grid-based layouts that adapt to all screen sizes
- **Smooth Animations**: Subtle transitions using Framer Motion
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful messages with action buttons
- **Card-based Design**: Organized content in elegant cards

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
