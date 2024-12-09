const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const session = require("express-session");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 5000;

// Session middleware setup
app.use(
  session({
    secret: "supersecretkey12345", // Use a strong, unique key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true for HTTPS in production
  })
);

// Google OAuth setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/oauth2callback";

// Middleware to serve static files and parse requests
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // Ensure the views directory exists

// Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.token) {
    oauth2Client.setCredentials(req.session.token);
    next();
  } else {
    res.redirect("/");
  }
};

// Route: Home page with Google authentication link
app.get("/", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/drive",
  });
  res.render("index", { authUrl }); // Render index.ejs
});

// Route: OAuth2 callback
app.get("/oauth2callback", (req, res) => {
  const code = req.query.code;
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.error("Error getting OAuth tokens:", err);
      return res.status(500).send("Error authenticating with Google");
    }
    req.session.token = tokens; // Store tokens in session
    res.redirect("/dashboard");
  });
});

// Route: Dashboard displaying Google Drive files
app.get("/dashboard", isAuthenticated, (req, res) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  drive.files.list(
    { pageSize: 20, fields: "files(id, name, mimeType)" },
    (err, response) => {
      if (err) {
        console.error("Error fetching files:", err);
        return res.status(500).send("Error fetching files from Google Drive");
      }
      res.render("dashboard", { files: response.data.files }); // Render dashboard.ejs
    }
  );
});

// File upload setup with multer
const upload = multer({ dest: "uploads/" });

app.post("/upload", isAuthenticated, upload.single("file"), (req, res) => {
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const fileMetadata = { name: req.file.originalname };
  const media = { body: fs.createReadStream(req.file.path) };

  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: "id",
    },
    (err, file) => {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).send("Error uploading the file.");
      }
      res.redirect("/dashboard");
    }
  );
});

// Route: Delete file
app.post("/delete/:fileId", isAuthenticated, (req, res) => {
  const fileId = req.params.fileId;
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  drive.files.delete({ fileId: fileId }, (err) => {
    if (err) {
      console.error("Error deleting the file:", err);
      return res.status(500).send("Error deleting the file.");
    }
    res.redirect("/dashboard");
  });
});

// Route: Download file
app.get("/download/:fileId", isAuthenticated, (req, res) => {
  const fileId = req.params.fileId;
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Retrieve file metadata
  drive.files.get(
    { fileId: fileId, fields: "name" },
    (err, metadataResponse) => {
      if (err) {
        console.error("Error fetching file metadata:", err);
        return res.status(500).send("Error fetching file metadata.");
      }

      const fileName = metadataResponse.data.name;

      // Fetch file content
      drive.files.get(
        { fileId: fileId, alt: "media" },
        { responseType: "stream" },
        (err, fileResponse) => {
          if (err) {
            console.error("Error downloading file:", err);
            return res.status(500).send("Error downloading the file.");
          }

          res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
          );
          fileResponse.data.pipe(res);
        }
      );
    }
  );
});

// Route: Logout (clear session)
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
