# Google Drive Integration App

This Node.js web application integrates with Google Drive using the Google API. It allows users to log in with Google, view their Google Drive files, upload files, download files, and delete files.

---

## Features

- **Google Authentication**: Secure login via Google OAuth2.
- **File Management**:
  - View files from your Google Drive.
  - Upload new files to your Google Drive.
  - Download existing files.
  - Delete files you no longer need.
- **Session Management**: Secure session handling using `express-session`.

---

## Prerequisites

### 1. Node.js
Ensure you have Node.js (version 14 or higher) installed. [Download Node.js](https://nodejs.org).

### 2. Google Cloud Console Configuration
Before using this app, you need to configure a Google Cloud project with the following steps:

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.

2. **Enable the Google Drive API**:
   - Navigate to "APIs & Services" > "Library."
   - Search for "Google Drive API" and enable it.

3. **Set Up OAuth2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials."
   - Click "Create Credentials" > "OAuth 2.0 Client IDs."
   - Configure the **redirect URI** as: `http://localhost:5000/oauth2callback`.
   - Save your **Client ID** and **Client Secret** for later use.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SaifVelly/GoogleDriveUpload.git
   cd google-drive-integration-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the project root and add:
     ```env
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

4. **Start the Application**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   - Open your browser and navigate to: `http://localhost:5000`.

---

## Usage

### 1. Login
- On the homepage, click the **Login with Google** button.
- Grant permissions to access your Google Drive.

### 2. Dashboard
- **View Files**: Displays files in your Google Drive.
- **Upload**: Use the upload button to add files.
- **Download**: Download any file from your Google Drive.
- **Delete**: Remove files you no longer need.

### 3. Logout
- Click the **Logout** button to end your session.

---

## Project Structure

```
project/
├── views/              # EJS templates
│   ├── index.ejs       # Login page
│   ├── dashboard.ejs   # Dashboard with file management options
├── public/             # Static assets (CSS, JS, images)
├── uploads/            # Temporary file storage for uploads
├── .env                # Environment variables (not tracked by Git)
├── index.js            # Main server file
├── package.json        # Project metadata and dependencies
├── .gitignore          # Ignored files and directories
```

---

## Technologies Used

- **Node.js**: Backend runtime.
- **Express**: Web framework.
- **EJS**: Templating engine for dynamic views.
- **Google APIs**: To interact with Google Drive.
- **Multer**: For file uploads.
- **express-session**: To manage user sessions.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Google Cloud Console](https://console.cloud.google.com/) for API services.
- [Node.js](https://nodejs.org/) for server runtime.

---
