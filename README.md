Project Documentation
🚀 Getting Started

Run in Development Mode
npm run dev

Build for Production
npm run build


🌐 Deployment

Deployment is managed through the client's Netlify account.

Steps:

Log in to the client’s Netlify dashboard.

Select the respective project.

Deploy the required branch.



🌿 Branch Structure

Dev – Development branch (used for ongoing development)

Main – Production branch (used for live deployment)

📁 Project Structure
src/

The src folder contains two primary directories:

1. Admin

Contains all Admin-related code.

Each page has its own folder.

Each page folder contains:

*.jsx – UI and logic

*.module.css – Page-specific styling

2. Barber

Contains all Barber-related code.

Each page has its own folder.

Each page folder contains:

*.jsx – UI and logic

*.module.css – Page-specific styling



🧩 Components
Admin Components

Sidebar

Mobile Sidebar

Header

Barber Components

Sidebar

Mobile Sidebar

Header

Shared Components

AuthLoader – Displays on page reload for authentication check

Loader – Displays during page transitions

ButtonLoader – Loader inside buttons during API calls

VersionCheck – Checks current web app version



❌ Error Handling
ErrorPage

Displays a custom error page when a route is not found.



🌍 Public Folder

Contains the initial landing page of the application.



🔐 Authentication Flow

Authentication is handled using Redux.

Auth token is attached to every API request.

Base URL configuration is managed inside the API setup.



🗂 Redux Structure

Inside the redux/ folder:

Admin

actions/ – Action creators for admin logic

reducers/ – Maintains admin state

Barber

actions/ – Action creators for barber logic

reducers/ – Maintains barber state



🏪 Store Configuration

All reducers (Admin + Barber) are combined inside:

store.js


This file creates the central Redux store for the application.



🎨 Theme Configuration
theme.js

Manages and applies the application’s theme settings.