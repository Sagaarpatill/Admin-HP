require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const twilio = require("twilio");
const { Client } = require("pg");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises; // Using fs.promises for async file operations
const multer = require("multer");


const app = express();

// --- Helper functions ---
const getFileTypeInfo = (mimetype) => {
    let icon = 'ri-file-line'; // Default
    let color = 'text-primary'; // Default

    if (mimetype.includes('image')) {
        icon = 'ri-image-2-fill';
        color = 'text-danger';
    } else if (mimetype.includes('pdf')) {
        icon = 'ri-file-pdf-fill';
        color = 'text-danger';
    } else if (mimetype.includes('zip') || mimetype.includes('rar')) {
        icon = 'ri-folder-zip-line';
        color = 'text-secondary';
    } else if (mimetype.includes('excel') || mimetype.includes('spreadsheet') || mimetype.includes('csv')) {
        icon = 'ri-file-excel-fill';
        color = 'text-success';
    } else if (mimetype.includes('word') || mimetype.includes('document')) {
        icon = 'ri-file-word-fill';
        color = 'text-info';
    } else if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) {
        icon = 'ri-file-ppt-fill';
        color = 'text-warning';
    } else if (mimetype.includes('text/plain')) {
        icon = 'ri-file-text-fill';
        color = 'text-dark';
    }
    return { icon, color };
};



app.use(
  cors({
    origin: "http://localhost:3000", // allow only your frontend
    credentials: true, // if you use cookies/sessions
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser (MUST BE BEFORE routes that use req.body for URL-encoded data)


// --- TEMPORARY: RAW MULTIPART REQUEST DEBUGGING MIDDLEWARE (Non-stream consuming version) ---
// This middleware will ONLY log the Content-Type header. It no longer consumes the stream,
// allowing Multer to process it.
app.use('/api/documents', (req, res, next) => {
    // Only intercept POST requests to /api/documents that claim to be multipart/form-data
    if (req.method === 'POST' && req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data')) {
        console.log("\n--- RAW MULTIPART REQUEST DEBUG (Headers Only) ---");
        console.log("Incoming Content-Type:", req.headers['content-type']); // Log the full Content-Type header
        // IMPORTANT: We are explicitly NOT reading req.on('data') or req.on('end') here
        // to avoid consuming the stream before Multer.
        next(); // Pass control to the next middleware (Multer for this route)
    } else {
        next(); // For all other requests (non-POST, non-multipart), just pass them through
    }
});
// --- END TEMPORARY DEBUGGING MIDDLEWARE ---

// --- Debugging Middleware (GLOBAL CATCHER for PUT requests) ---
app.use((req, res, next) => {
    if (req.method === 'PUT') {
        console.log('--- DEBUG: Received a PUT request (Global Catcher) ---');
        console.log('Path:', req.path);
        console.log('Body (after express.json/urlencoded):', req.body); // Check body AFTER parsing middleware
        console.log('Headers:', req.headers);
    }
    next();
});

// --- File Uploads Setup (Multer) ---
const uploadDir = path.join(__dirname, 'uploads');

fsPromises.mkdir(uploadDir, { recursive: true }).catch(err => {
    console.error('Failed to create upload directory:', err);
    // In a production app, you might want to process.exit(1) here if dir creation is critical
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Ensure this path is correct and writable
    },
    filename: function (req, file, cb) {
        // Use originalname with a timestamp to prevent overwrites and maintain extension
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// --- TWILIO SETUP ---
// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// --- POSTGRES CLIENT (for raw queries) ---
const client = new Client({
    user: process.env.DB_USER || "postgres", // Use env variable if available
    host: process.env.DB_HOST || "localhost",       // <--- CHANGE THIS FROM "localhost" TO "db"
    database: process.env.DB_DATABASE || "houzingpartners", // Use env variable if available
    password: process.env.DB_PASSWORD || "Sagar@1", // Use env variable if available
    port: process.env.DB_PORT || 5432,       // Use env variable if available
    connectionString: process.env.DATABASE_URL, // This is good, but make sure it uses 'db' too
});

// ***********************************************************************************

// Production DB Connection.
// const con = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "houzingpartners",
//   password: "Sagar@1",
//   port: 5432,
//   // You mentioned schema: "hp", but typically you'd include the schema in the query
//   // or set it as a search_path for the user. For clarity, I'll include it in queries.
//   connectionString: process.env.DATABASE_URL, // from .env
// });

// ***********************************************************************************

client.connect((err) => {
  if (err) console.error("Connection error", err.stack);
  else console.log("Connected to PostgreSQL");
});

// --- Serve Static Files (MUST BE BEFORE any catch-all routes if you want files served) ---
app.use("/uploads", express.static(uploadDir));

// --- GLOBAL ERROR HANDLERS (for uncaught exceptions/rejections) ---
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
    // In a production app, consider process.exit(1) for clean crashes
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("UNHANDLED REJECTION:", reason);
});


// --- OTP In-Memory Store (for dev) ---
const otpStore = {};
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// --- OTP Routes ---
app.post("/api/send-otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const otp = generateOTP();
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  try {
    // await twilioClient.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });
    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error("Twilio error:", err);
    res.status(500).json({ error: "Failed to send OTP", details: err.message });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore[phone];
  if (!record)
    return res.status(400).json({ error: "No OTP sent to this number" });
  if (Date.now() > record.expires)
    return res.status(400).json({ error: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  delete otpStore[phone];
  res.json({ success: true, message: "OTP verified" });
});

// --- Customer Routes ---
app.get("/api/add_customers", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT ac_id, ac_first_name, ac_last_name, ac_phone_number, ac_address, ac_created_date, ac_status, ac_is_active
      FROM hp.add_customers
    `); // <-- 'ac_status' is back here!
    res.json(result.rows);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new customer
app.post("/api/add_customers", async (req, res) => {
  // Ensure 'address' is destructured from req.body
  const { first_name, last_name, phone_number, address } = req.body; // Good, 'address' is here

  if (!first_name || !phone_number) {
    return res
      .status(400)
      .json({ error: "First name and phone number are required." });
  }

  try {
    const result = await client.query(
      `INSERT INTO hp.add_customers (ac_first_name, ac_last_name, ac_phone_number, ac_address, ac_is_active, ac_status, ac_created_date)
       VALUES ($1, $2, $3, $4, TRUE, 'Active', NOW()) RETURNING *`, // Added $4 for ac_address
      [first_name, last_name, phone_number, address] // <--- This array now correctly corresponds to $1, $2, $3, $4
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error in /api/add_customers POST:", err);
    res
      .status(500)
      .json({ error: "Failed to add customer", details: err.message });
  }
});

// Update an existing customer
app.put("/api/add_customers/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, address, status } = req.body;
  if (!first_name || !phone_number) {
    return res
      .status(400)
      .json({ error: "First name and phone number are required." });
  }

  // Determine ac_is_active based on the 'status' sent from the frontend
  const ac_is_active = status === "Active";

  try {
    const result = await client.query(
      `UPDATE hp.add_customers SET 
       ac_first_name = $1, 
       ac_last_name = $2,
       ac_phone_number = $3, 
       ac_address = $4, 
       ac_is_active = $5,
       ac_status = $6,
       ac_updated_date = NOW()
       WHERE ac_id = $7 RETURNING *`,
      [first_name, last_name, phone_number, address, ac_is_active, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in /api/add_customers PUT:", err);
    res
      .status(500)
      .json({ error: "Failed to update customer", details: err.message });
  }
});

// Delete a customer
app.delete("/api/add_customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM hp.add_customers WHERE ac_id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Customer not found." });
    }
    res.status(204).send(); // No content to send back on successful deletion
  } catch (err) {
    console.error("Error in /api/add_customers DELETE:", err);
    res
      .status(500)
      .json({ error: "Failed to delete customer", details: err.message });
  }
});

// Supervisor Routes
app.get('/api/widgets-data', async (req, res) => {
  try {
    const queryText = `
      SELECT
        as_id,
        as_first_name,
        as_last_name,
        as_phone_number,
        as_location,
        as_updated_at,
        as_status,
        as_is_active
      FROM
        hp.add_supervisors;
    `;
    const result = await client.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching widgets data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// Delete a Supervisor
// Delete a Supervisor
app.delete("/api/Delete_Supervisor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Start a transaction for atomicity
    await client.query('BEGIN');

    // 1. First, set the foreign key in project_grid to NULL for this supervisor
    //    OR delete the related records in project_grid.
    //    I'm suggesting setting to NULL as it's less destructive for testing.
    //    Make sure 'fk_pg_supervisor_id' column in project_grid allows NULLs.
    await client.query(
        `UPDATE hp.project_grid
         SET pg_supervisor_id = NULL
         WHERE pg_supervisor_id = $1;`,
        [id]
    );

    // 2. Now, delete the supervisor from add_supervisors
    const result = await client.query(
      "DELETE FROM hp.add_supervisors WHERE as_id = $1",
      [id]
    );

    // Commit the transaction if all queries succeed
    await client.query('COMMIT');

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supervisor not found." });
    }
    res.status(204).send(); 
  } catch (err) {
    
    await client.query('ROLLBACK');
    console.error("Error in /api/Delete_Supervisor DELETE:", err); // Corrected route name in log
    res.status(500).json({ error: "Failed to delete Supervisor", details: err.message });
  }
});


// Add a new supervisor
app.post('/api/add_supervisors', async (req, res) => {
  const { first_name, last_name, phone_number, address, status } = req.body;

  if (!first_name || !phone_number) {
    return res.status(400).json({ error: "First name and phone number are required." });
  }

  const is_active_status = status === "Active";

  try {
    const insertQuery = `
      INSERT INTO hp.add_supervisors (as_first_name, as_last_name, as_phone_number, as_location, as_status, as_is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [first_name, last_name, phone_number, address, status, is_active_status];
    const result = await client.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error in /api/add_supervisors POST:", err);

    // --- ADD THE PROVIDED ERROR HANDLING BLOCK HERE ---
    // if (err.code === '23505') {
    // // ... (keep your first_name and phone_number checks if applicable)
    // if (err.detail.includes('add_supervisors_as_last_name_key')) { // This is the line that's correctly triggering
    //     return res.status(400).json({ error: "Failed to add supervisor: The last name already exists. Please choose a different last name.", details: err.detail });
    //     }
    //     if (err.detail.includes('add_supervisors_as_phone_number_key')) {
    //         return res.status(400).json({ error: "Failed to add supervisor: The phone number already exists.", details: err.detail });
    //     }
    //     // If you have a unique constraint on last_name, keep this:
    //     if (err.detail.includes('add_supervisors_as_last_name_key')) {
    //          return res.status(400).json({ error: "Failed to add supervisor: The last name already exists. Please choose a different last name.", details: err.detail });
    //     }
    //     // ... any other specific unique constraints
    // }
    // Fallback for other errors (this line was already present)
    res.status(500).json({ error: "Failed to add supervisor", details: err.message });
  }
});

// Update an existing supervisor
app.put('/api/Updated_supervisors/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, address, status } = req.body;

  if (!first_name || !phone_number) {
    return res.status(400).json({ error: "First name and phone number are required." });
  }

  const as_is_active = status === "Active"; // Convert status to boolean

  try {
    const updateQuery = `
      UPDATE hp.add_supervisors
      SET
        as_first_name = $1,
        as_last_name = $2,
        as_phone_number = $3,
        as_location = $4,
        as_status = $5,
        as_updated_at = NOW(),
        as_is_active = $6
      WHERE
        as_id = $7
      RETURNING *;
    `;
    const values = [first_name, last_name, phone_number, address, status, as_is_active, id];
    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supervisor not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error in /api/Updated_supervisors PUT:", err);

    // --- Start of NEW/MODIFIED error handling ---
    if (err.code === '23505' && err.detail.includes('add_supervisors_as_last_name_key')) {
      // Specific error for duplicate last name
      return res.status(400).json({ error: "Failed to update supervisor: The last name already exists. Please choose a different last name.", details: err.detail });
    }
    // You might also have a unique constraint on phone_number. If so, add another check:
    if (err.code === '23505' && err.detail.includes('add_supervisors_as_phone_number_key')) { // Adjust constraint name as per your DB
      return res.status(400).json({ error: "Failed to update supervisor: The phone number already exists.", details: err.detail });
    }
    // --- End of NEW/MODIFIED error handling ---

    res.status(500).json({ error: "Failed to update supervisor", details: err.message });
  }
});

// --- GLOBAL ERROR HANDLERS (CRUCIAL FOR DEBUGGING CRASHES) ---
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
    // Log the promise that was rejected
  // console.error('Promise:', promise);
});

app.use("/uploads", express.static(uploadDir));
// --- MODIFIED: Aligning supervisor and adding customer routes ---

// // Endpoint to fetch supervisors
// app.get("/api/supervisors", (req, res) => {
//     console.log("--- Fetch Supervisors API Call Initiated ---");
//     // This query includes 'as_email'
//     const fetch_query = `SELECT as_id as id, as_first_name as name, as_phone_number as phone_number, as_email as email FROM hp.add_supervisors WHERE as_is_active = TRUE;`;
//     client.query(fetch_query, (err, result) => {
//         if (err) {
//             console.error("Error fetching supervisors:", err.stack);
//             res.status(500).json({ success: false, message: "Error fetching supervisors" });
//         } else {
//             console.log(`Fetched ${result.rows.length} supervisors.`);
//             res.status(200).json(result.rows);
//         }
//     });
// });

// NEW: Endpoint to fetch customers (assuming a hp.add_customers table or similar)
app.get("/api/customers", async (req, res) => {
  console.log("--- Fetch Customers API Call Initiated ---");
  try {
    const fetch_query = `SELECT ac_id as id, ac_phone_number as phone, ac_first_name as name FROM hp.add_customers WHERE ac_is_active = TRUE;`;
    const result = await client.query(fetch_query);
    
    console.log(`Fetched ${result.rows.length} customers.`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error.stack);
    res.status(500).json({ success: false, message: "Error fetching customers" });
  }
});


// =========================================================================
// --- API ENDPOINTS (ORDER MATTERS FOR SPECIFICITY) ---
// =========================================================================

// Document Status Update (MOST SPECIFIC PUT for /api/documents/:id/status)
// This route should come before the general /api/documents/:id PUT route.
app.put("/api/documents/:id/status", async (req, res) => {
    console.log("--- Document Status Update API Call Initiated ---");
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Backend: Attempting to update status for ID ${id} to "${status}"`);
    console.log("Backend: req.body for status update:", req.body);

    if (!status || (status !== 'Verified' && status !== 'Unverified')) {
        console.error(`Backend: Invalid status received for ID ${id}: "${status}"`);
        return res.status(400).json({ message: "Invalid status provided. Must be 'Verified' or 'Unverified'." });
    }

    try {
        const query = `
            UPDATE hp.documents
            SET doc_status = $1
            WHERE doc_id = $2
            RETURNING doc_id as id, doc_name as name, doc_category as category, doc_type as type, doc_size as size, doc_upload_date as date, doc_status as status, doc_icon as icon, doc_color as color, doc_file_url as fileUrl;
        `;
        const values = [status, id];

        console.log("SQL Query (Update Document Status):", query);
        console.log("SQL Values (Update Document Status):", values);

        const result = await client.query(query, values);
        const updatedDocument = result.rows[0];

        if (updatedDocument) {
            updatedDocument.date = new Date(updatedDocument.date).toLocaleDateString('en-GB');
            console.log("Backend: Document status updated successfully:", updatedDocument);
            res.status(200).json(updatedDocument);
        } else {
            console.log("Backend: Document not found for status update:", id);
            res.status(404).json({ success: false, message: "Document not found" });
        }
    } catch (error) {
        console.error("--- Error updating document status ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, message: "Internal server error during status update." });
    } finally {
        console.log("--- Document Status Update API Call Finished ---");
    }
});


// Endpoint to upload a new document (Consolidated and Corrected)
// This route is placed after the status update route as it's a different HTTP method.
app.post("/api/documents", upload.single("file"), async (req, res) => {
    console.log("--- Document Upload API Call Initiated ---");
    console.log("Request Body (text fields from FormData):", req.body); // Log body including projectId
    console.log("Multer File (processed file object):", req.file); // Log file details

    try {
        if (!req.file) {
            console.error("Backend Error: No file received by Multer.");
            return res.status(400).json({ message: "No file uploaded or Multer failed to process the file." });
        }

        const { name, category, projectId } = req.body;
        const { originalname, mimetype, size, filename, path: filePath } = req.file;

        if (!name || !category || !projectId) {
            if (filePath) await fsPromises.unlink(filePath).catch(err => console.error('Failed to delete temp file:', err));
            return res.status(400).json({ message: "Document name, category, and project ID are required." });
        }

        const { icon, color } = getFileTypeInfo(mimetype);
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

        const query = `
            INSERT INTO hp.documents (doc_name, doc_category, doc_type, doc_size, doc_icon, doc_color, doc_file_path, doc_file_url, doc_status, project_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Unverified', $9)
            RETURNING doc_id as id, doc_name as name, doc_category as category, doc_type as type, doc_size as size, doc_upload_date as date, doc_status as status, doc_icon as icon, doc_color as color, doc_file_url as fileurl;
        `;
        const values = [
            name,
            category,
            mimetype,
            `${(size / 1024 / 1024).toFixed(2)} MB`,
            icon,
            color,
            filePath,
            fileUrl,
            projectId
        ];

        console.log("SQL Query (Insert Document):", query);
        console.log("SQL Values (Insert Document):", values);

        const result = await client.query(query, values);
        const newDocument = result.rows[0];

        console.log("Document uploaded successfully:", newDocument);
        res.status(201).json(newDocument);
    } catch (error) {
        console.error("--- Error uploading document ---");
        console.error("Error details:", error);
        if (req.file && req.file.path) {
            await fsPromises.unlink(req.file.path).catch(err => console.error('Failed to delete temp file on error:', err));
        }
        res.status(500).json({ success: false, message: "Internal server error during document upload." });
    } finally {
        console.log("--- Document Upload API Call Finished ---");
    }
});

// Document Update (MORE GENERAL PUT for /api/documents/:id)
// This route should come AFTER the more specific /api/documents/:id/status PUT route.
app.put("/api/documents/:id", upload.single("file"), async (req, res) => {
    console.log("--- Document Update API Call Initiated ---");
    const documentId = req.params.id;
    const { name, category } = req.body;
    const newFile = req.file;

    try {
        const currentDocQuery = `SELECT * FROM hp.documents WHERE doc_id = $1;`;
        const currentDocResult = await client.query(currentDocQuery, [documentId]);
        const existingDocument = currentDocResult.rows[0];

        if (!existingDocument) {
            if (newFile) await fsPromises.unlink(newFile.path);
            return res.status(404).json({ message: "Document not found." });
        }

        let updatedFields = {
            doc_name: name || existingDocument.doc_name,
            doc_category: category || existingDocument.doc_category,
            doc_type: existingDocument.doc_type,
            doc_size: existingDocument.doc_size,
            doc_icon: existingDocument.doc_icon,
            doc_color: existingDocument.doc_color,
            doc_file_path: existingDocument.doc_file_path,
            doc_file_url: existingDocument.doc_file_url,
        };

        if (newFile) {
            // Check if old file exists and delete it
            try {
                if (existingDocument.doc_file_path) {
                    await fsPromises.access(existingDocument.doc_file_path, fs.constants.F_OK); // Check if file exists
                    await fsPromises.unlink(existingDocument.doc_file_path); // Delete old file
                }
            } catch (err) {
                if (err.code !== 'ENOENT') { // Ignore "file not found" error, log others
                    console.error('Failed to delete old file:', err);
                }
            }

            const { mimetype, size, filename, path: newFilePath } = newFile;
            const { icon, color } = getFileTypeInfo(mimetype);
            const newFileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;

            updatedFields.doc_type = mimetype;
            updatedFields.doc_size = `${(size / 1024 / 1024).toFixed(2)} MB`;
            updatedFields.doc_icon = icon;
            updatedFields.doc_color = color;
            updatedFields.doc_file_path = newFilePath;
            updatedFields.doc_file_url = newFileUrl;
        }

        const updateQuery = `
            UPDATE hp.documents
            SET
                doc_name = $1,
                doc_category = $2,
                doc_type = $3,
                doc_size = $4,
                doc_icon = $5,
                doc_color = $6,
                doc_file_path = $7,
                doc_file_url = $8
            WHERE doc_id = $9
            RETURNING doc_id as id, doc_name as name, doc_category as category, doc_type as type, doc_size as size, doc_upload_date as date, doc_status as status, doc_icon as icon, doc_color as color, doc_file_url as fileurl;
        `;
        const values = [
            updatedFields.doc_name,
            updatedFields.doc_category,
            updatedFields.doc_type,
            updatedFields.doc_size,
            updatedFields.doc_icon,
            updatedFields.doc_color,
            updatedFields.doc_file_path,
            updatedFields.doc_file_url,
            documentId
        ];

        console.log("SQL Query (Update Document):", updateQuery);
        console.log("SQL Values (Update Document):", values);

        const result = await client.query(updateQuery, values);
        const updatedDocument = result.rows[0];
        if (updatedDocument) {
            updatedDocument.date = new Date(updatedDocument.date).toLocaleDateString('en-GB');
            console.log("Document updated successfully:", updatedDocument);
            res.status(200).json(updatedDocument);
        } else {
            console.log("Document not found for update:", documentId);
            res.status(404).json({ success: false, message: "Document not found" });
        }
    } catch (error) {
        console.error("--- Error updating document ---");
        console.error("Error details:", error);
        if (newFile && newFile.path) {
            await fsPromises.unlink(newFile.path).catch(err => console.error('Failed to delete temp file during error:', err));
        }
        res.status(500).json({ success: false, message: "Internal server error during document update." });
    } finally {
        console.log("--- Document Update API Call Finished ---");
    }
});


// Endpoint to fetch all documents (Consolidated and Corrected)
app.get("/api/documents", async (req, res) => {
    console.log("--- Fetch All Documents API Call Initiated ---");
    const { projectId } = req.query; // Get projectId from query params

    let query = `SELECT doc_id as id, doc_name as name, doc_category as category, doc_type as type, doc_size as size, doc_upload_date as date, doc_status as status, doc_icon as icon, doc_color as color, doc_file_url as fileurl FROM hp.documents`;
    const queryParams = [];

    if (projectId) {
        query += ' WHERE project_id = $1'; // Add WHERE clause if projectId is provided
        queryParams.push(projectId);
    }
    query += ' ORDER BY doc_upload_date DESC, doc_id DESC;'; // Add ordering

    try {
        const result = await client.query(query, queryParams);
        console.log(`Fetched ${result.rows.length} documents.`);
        const documents = result.rows.map(doc => ({
            ...doc,
            date: new Date(doc.date).toLocaleDateString('en-GB')
        }));
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error.stack);
        res.status(500).json({ success: false, message: "Error fetching documents" });
    } finally {
        console.log("--- Fetch All Documents API Call Finished ---");
    }
});


// Endpoint to delete a document (Consolidated and Corrected)
app.delete("/api/documents/:id", async (req, res) => {
    console.log("--- Document Delete API Call Initiated ---");
    const documentId = req.params.id;

    try {
        const getFilePathQuery = `SELECT doc_file_path FROM hp.documents WHERE doc_id = $1;`;
        const filePathResult = await client.query(getFilePathQuery, [documentId]);
        const filePath = filePathResult.rows[0]?.doc_file_path;

        const deleteQuery = `DELETE FROM hp.documents WHERE doc_id = $1 RETURNING doc_id;`;
        const result = await client.query(deleteQuery, [documentId]);

        if (result.rows.length > 0) {
            if (filePath) { // Only attempt to delete if path exists in DB
                try {
                    await fsPromises.access(filePath, fs.constants.F_OK); // Check if file exists
                    await fsPromises.unlink(filePath); // Delete old file
                } catch (err) {
                    if (err.code !== 'ENOENT') { // Ignore "file not found" error, log others
                        console.error('Failed to delete old file from disk:', err);
                    }
                }
            }
            console.log("Document deleted successfully:", result.rows[0].doc_id);
            res.status(204).send();
        } else {
            console.log("Document not found for deletion:", documentId);
            res.status(404).json({ success: false, message: "Document not found" });
        }
    } catch (error) {
        console.error("--- Error deleting document ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, message: "Internal server error during document deletion." });
    } finally {
        console.log("--- Document Delete API Call Finished ---");
    }
});
app.get("/api/supervisors", (req, res) => {
    console.log("--- Fetch Supervisors API Call Initiated ---");
    const fetch_query = `SELECT
                           as_id as id,
                           as_first_name as first_name,   -- Change: Alias to first_name
                           as_last_name as last_name,     -- Add this line to get last_name
                           as_phone_number as phone_number,
                           as_email as email,
                           as_is_active as is_active,
                           as_location as address,
                           as_status as status            -- Crucial: Make sure as_status is selected as 'status'
                         FROM hp.add_supervisors;`;
    client.query(fetch_query, (err, result) => {
        if (err) {
            console.error("Error fetching supervisors:", err.stack);
            res.status(500).json({ success: false, message: "Error fetching supervisors" });
        } else {
            console.log(`Fetched ${result.rows.length} supervisors.`);
            res.status(200).json(result.rows);
        }
    });
});

// Endpoint to fetch customers
app.get("/api/customers", async (req, res) => {
    console.log("--- Fetch Customers API Call Initiated ---");
    try {
        const fetch_query = `SELECT ac_id as id, ac_phone_number as phone, ac_first_name as name, ac_email as email FROM hp.add_customers WHERE ac_is_active = TRUE;`;
        const result = await client.query(fetch_query);

        console.log(`Fetched ${result.rows.length} customers.`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching customers:", error.stack);
        res.status(500).json({ success: false, message: "Error fetching customers" });
    } finally {
        console.log("--- Fetch Customers API Call Finished ---");
    }
});

// --- API Endpoints for hp.project_grid ---

// Endpoint to create a new project
app.post(
    "/api/projects",
    upload.fields([
        { name: "bimFilePath", maxCount: 1 },
        { name: "floorPlanFilePath", maxCount: 1 },
        { name: "designFilePath", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            console.log(
                "--- Project Creation API Call Initiated (hp.project_grid) ---"
            );
            console.log("Received body:", req.body); // Check this log carefully for "null" strings
            console.log("Received files:", req.files);

            const {
                projectName,
                pinCode,
                latitude,
                longitude,
                projectType,
                landArea,
                constructionArea,
                numFloors,
                numRooms,
                numKitchens,
                customerPhone,
                startDate,
                endDate,
                projectCost,
                description,
                supervisorId,
                supervisorId2,
                supervisorId3
            } = req.body;

            // --- IMPORTANT: Robust Parsing on Backend ---
            // Helper function to safely parse integers or return null
            const safeParseInt = (value) => {
                const parsed = parseInt(value, 10);
                return isNaN(parsed) ? null : parsed;
            };

            // Helper function to safely parse floats/numerics or return null
            const safeParseFloat = (value) => {
                const parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            };

            const parsedNumFloors = safeParseInt(numFloors);
            const parsedNumRooms = safeParseInt(numRooms);
            const parsedNumKitchens = safeParseInt(numKitchens);

            const parsedSupervisorId = safeParseInt(supervisorId);
            const parsedSupervisorId2 = safeParseInt(supervisorId2);
            const parsedSupervisorId3 = safeParseInt(supervisorId3);

            const parsedLatitude = safeParseFloat(latitude);
            const parsedLongitude = safeParseFloat(longitude);
            const parsedLandArea = safeParseFloat(landArea);
            const parsedConstructionArea = safeParseFloat(constructionArea);
            const parsedProjectCost = safeParseFloat(projectCost);
            // --- END Robust Parsing ---


            // Determine the primary supervisor ID for the database column
            const primarySupervisorId = parsedSupervisorId; // Now direct as it's already parsed to null or number

            // Extract file paths from multer
            const bimFilePath = req.files && req.files['bimFilePath'] ? req.files['bimFilePath'][0].path : null;
            const floorPlanFilePath = req.files && req.files['floorPlanFilePath'] ? req.files['floorPlanFilePath'][0].path : null;
            const designFilePath = req.files && req.files['designFilePath'] ? req.files['designFilePath'][0].path : null;

            // Basic Validation (still good to have)
            if (!customerPhone) {
                if (bimFilePath) await fsPromises.unlink(bimFilePath).catch(err => console.error('Failed to delete temp BIM file:', err));
                if (floorPlanFilePath) await fsPromises.unlink(floorPlanFilePath).catch(err => console.error('Failed to delete temp Floor Plan file:', err));
                if (designFilePath) await fsPromises.unlink(designFilePath).catch(err => console.error('Failed to delete temp Design file:', err));
                return res.status(400).json({ success: false, message: "Customer phone is required." });
            }
            if (primarySupervisorId === null) {
                if (bimFilePath) await fsPromises.unlink(bimFilePath).catch(err => console.error('Failed to delete temp BIM file:', err));
                if (floorPlanFilePath) await fsPromises.unlink(floorPlanFilePath).catch(err => console.error('Failed to delete temp Floor Plan file:', err));
                if (designFilePath) await fsPromises.unlink(designFilePath).catch(err => console.error('Failed to delete temp Design file:', err));
                return res.status(400).json({ success: false, message: "At least one valid Supervisor ID (Supervisor 1) is required." });
            }

            // Dates from frontend are already 'YYYY-MM-DD' from Flatpickr's toISOString().split('T')[0]
            const parsedStartDate = startDate || null;
            const parsedEndDate = endDate || null;

            const projectStatus = 'In Progress'; // Default status

            const query = `
                INSERT INTO hp.project_grid (
                    pg_project_name, pg_pin_code, pg_latitude, pg_longitude,
                    pg_project_type, pg_land_area, pg_construction_area,
                    pg_num_floors, pg_num_rooms, pg_num_kitchens,
                    pg_customer_phone, pg_start_date, pg_end_date,
                    pg_project_cost, pg_supervisor_id,
                    pg_bim_file_path, pg_floor_plan_file_path, pg_design_file_path,
                    pg_status, pg_is_active, pg_description,
                    pg_supervisor2_id, pg_supervisor3_id
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                    $11, $12, $13, $14, $15,
                    $16, $17, $18,
                    $19, $20, $21,
                    $22, $23
                ) RETURNING pg_project_id, pg_project_name, pg_pin_code, pg_latitude, pg_longitude,
                            pg_project_type, pg_land_area, pg_construction_area,
                            pg_num_floors, pg_num_rooms, pg_num_kitchens,
                            pg_customer_phone, pg_start_date, pg_end_date,
                            pg_project_cost, pg_supervisor_id,
                            pg_bim_file_path, pg_floor_plan_file_path, pg_design_file_path,
                            pg_status, pg_is_active, pg_description,
                            pg_supervisor2_id, pg_supervisor3_id;
            `;

            const values = [
                projectName, pinCode, parsedLatitude, parsedLongitude,
                projectType, parsedLandArea, parsedConstructionArea,
                parsedNumFloors, parsedNumRooms, parsedNumKitchens,
                customerPhone, parsedStartDate, parsedEndDate,
                parsedProjectCost, primarySupervisorId,
                bimFilePath, floorPlanFilePath, designFilePath,
                projectStatus, true, description,
                parsedSupervisorId2, parsedSupervisorId3
            ];

            console.log("SQL Query (Insert Project):", query);
            console.log("SQL Values (Insert Project):", values);

            const result = await client.query(query, values);
            const newProject = result.rows[0];

            console.log("Project inserted successfully:", newProject);
            res.status(201).json({ success: true, project: newProject });
        } catch (error) {
            console.error("--- Error inserting project ---");
            console.error("Error details:", error);
            if (error.code) {
                console.error("PostgreSQL Error Code:", error.code);
                console.error("PostgreSQL Error Message:", error.message);
            }
            // Clean up uploaded files if an error occurred during DB insertion
            if (req.files && req.files['bimFilePath'] && req.files['bimFilePath'][0].path) {
                await fsPromises.unlink(req.files['bimFilePath'][0].path).catch(err => console.error('Failed to delete BIM temp file:', err));
            }
            if (req.files && req.files['floorPlanFilePath'] && req.files['floorPlanFilePath'][0].path) {
                await fsPromises.unlink(req.files['floorPlanFilePath'][0].path).catch(err => console.error('Failed to delete Floor Plan temp file:', err));
            }
            if (req.files && req.files['designFilePath'] && req.files['designFilePath'][0].path) {
                await fsPromises.unlink(req.files['designFilePath'][0].path).catch(err => console.error('Failed to delete Design temp file:', err));
            }
            res.status(500).json({ success: false, error: error.message });
        } finally {
            console.log("--- Project Creation API Call Finished ---");
        }
    }
);
// Endpoint to get all projects
app.get("/api/projects", async (req, res) => {
    try {
        console.log(
            "--- Get All Projects API Call Initiated (hp.project_grid) ---"
        );
        // MODIFIED QUERY: Include all necessary columns and join for supervisor name
        const result = await client.query(
            `SELECT
                pg.pg_project_id,
                pg.pg_project_name,
                pg.pg_is_active,
                pg.pg_created_date,
                pg.pg_updated_date,            -- Add this
                pg.pg_steps_completed,        -- Add this
                pg.pg_work_completed_percent, -- Add this
                pg.pg_payment_due_percent,    -- Add this
                pg.pg_project_cost,           -- Add this
                s.as_first_name AS pg_supervisor_name -- Join to get supervisor name
            FROM
                hp.project_grid pg
            LEFT JOIN
                hp.add_supervisors s ON pg.pg_supervisor_id = s.as_id -- Assuming pg_supervisor_id links to as_id
            ORDER BY pg.pg_created_date DESC`
        );
        console.log("Projects fetched successfully:", result.rows.length);
        res.status(200).json({ success: true, projects: result.rows });
    } catch (error) {
        console.error("--- Error fetching projects ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        console.log("--- Get All Projects API Call Finished ---");
    }
});

// NEW: Endpoint to get a single project by ID (for OverviewTab)
app.get("/api/projects/:id", async (req, res) => {
    console.log("--- Fetch Single Project API Call Initiated ---");
    const { id } = req.params;

    try {
        const query = `
            SELECT
                pg.pg_project_id,
                pg.pg_project_name,
                pg.pg_pin_code,
                pg.pg_latitude,
                pg.pg_longitude,
                pg.pg_project_type,
                pg.pg_land_area,
                pg.pg_construction_area,
                pg.pg_num_floors,
                pg.pg_num_rooms,
                pg.pg_num_kitchens,
                pg.pg_project_cost,
                pg.pg_start_date,
                pg.pg_end_date,
                pg.pg_bim_file_path,
                pg.pg_floor_plan_file_path,
                pg.pg_design_file_path,
                pg.pg_status,
                pg.pg_description, -- Include description
                ac.ac_first_name AS customer_name,
                ac.ac_phone_number AS customer_phone_number,
                ac.ac_email AS customer_email, -- Added customer email
                sup1.as_first_name AS supervisor1_name,
                sup1.as_phone_number AS supervisor1_phone_number,
                sup1.as_email AS supervisor1_email,
                sup2.as_first_name AS supervisor2_name,
                sup2.as_phone_number AS supervisor2_phone_number,
                sup2.as_email AS supervisor2_email,
                sup3.as_first_name AS supervisor3_name,
                sup3.as_phone_number AS supervisor3_phone_number,
                sup3.as_email AS supervisor3_email
            FROM
                hp.project_grid pg
            LEFT JOIN
                hp.add_customers ac ON pg.pg_customer_phone = ac.ac_phone_number
            LEFT JOIN
                hp.add_supervisors sup1 ON pg.pg_supervisor_id = sup1.as_id
            LEFT JOIN
                hp.add_supervisors sup2 ON pg.pg_supervisor2_id = sup2.as_id -- Join for supervisor 2
            LEFT JOIN
                hp.add_supervisors sup3 ON pg.pg_supervisor3_id = sup3.as_id -- Join for supervisor 3
            WHERE
                pg.pg_project_id = $1;
        `;
        const values = [id];

        console.log("SQL Query (Fetch Single Project):", query);
        console.log("SQL Values (Fetch Single Project):", values);

        const result = await client.query(query, values);
        const project = result.rows[0];

        if (project) {
            // Format dates to ISO-MM-DD if they are Date objects from DB
            project.pg_start_date = project.pg_start_date ? new Date(project.pg_start_date).toISOString().split('T')[0] : null;
            project.pg_end_date = project.pg_end_date ? new Date(project.pg_end_date).toISOString().split('T')[0] : null;

            // Construct full URLs for files
            const host = req.get('host');
            const protocol = req.protocol;

            // Ensure these paths store just the filename or a relative path, not absolute.
            // Multer stores full path, but if DB stores just filename, adjust path.basename()
            const bimFileUrl = project.pg_bim_file_path ? `${protocol}://${host}/uploads/${path.basename(project.pg_bim_file_path)}` : null;
            const floorPlanFileUrl = project.pg_floor_plan_file_path ? `${protocol}://${host}/uploads/${path.basename(project.pg_floor_plan_file_path)}` : null;
            const designFileUrl = project.pg_design_file_path ? `${protocol}://${host}/uploads/${path.basename(project.pg_design_file_path)}` : null;


            const responseProject = {
                projectId: project.pg_project_id,
                projectName: project.pg_project_name,
                pinCode: project.pg_pin_code,
                latitude: parseFloat(project.pg_latitude), // Ensure numerical
                longitude: parseFloat(project.pg_longitude), // Ensure numerical
                projectType: project.pg_project_type,
                landArea: parseFloat(project.pg_land_area), // Ensure numerical
                constructionArea: parseFloat(project.pg_construction_area), // Ensure numerical
                numFloors: parseInt(project.pg_num_floors, 10), // Ensure numerical
                numRooms: parseInt(project.pg_num_rooms, 10), // Ensure numerical
                numKitchens: parseInt(project.pg_num_kitchens, 10), // Ensure numerical
                projectCost: parseFloat(project.pg_project_cost), // Ensure numerical
                startDate: project.pg_start_date,
                endDate: project.pg_end_date,
                status: project.pg_status || "In Progress", // Default status if not set in DB
                bimFilePath: bimFileUrl,
                floorPlanFilePath: floorPlanFileUrl,
                designFilePath: designFileUrl,
                description: project.pg_description, // Include description
                customer: {
                    name: project.customer_name,
                    phoneNumber: project.customer_phone_number,
                    email: project.customer_email // Added customer email
                },
                supervisor1: project.supervisor1_name ? { // Check if supervisor1 exists
                    name: project.supervisor1_name,
                    phoneNumber: project.supervisor1_phone_number,
                    email: project.supervisor1_email
                } : null,
                supervisor2: project.supervisor2_name ? { // Check if supervisor2 exists
                    name: project.supervisor2_name,
                    phoneNumber: project.supervisor2_phone_number,
                    email: project.supervisor2_email
                } : null,
                supervisor3: project.supervisor3_name ? { // Check if supervisor3 exists
                    name: project.supervisor3_name,
                    phoneNumber: project.supervisor3_phone_number,
                    email: project.supervisor3_email
                } : null
            };
            console.log("Fetched single project successfully:", responseProject);
            res.status(200).json(responseProject);
        } else {
            console.log("Project not found for ID:", id);
            res.status(404).json({ success: false, message: "Project not found" });
        }
    } catch (error) {
        console.error("--- Error fetching single project ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, message: "Internal server error during project fetch." });
    } finally {
        console.log("--- Fetch Single Project API Call Finished ---");
    }
});


// Endpoint to update a project
app.put("/api/projects/:id", async (req, res) => {
    try {
        console.log("--- Project Update API Call Initiated (hp.project_grid) ---");
        const projectId = req.params.id;
        const {
            projectName,
            pinCode,
            latitude,
            longitude,
            projectType,
            landArea,
            constructionArea,
            numFloors,
            numRooms,
            numKitchens,
            customerPhone,
            startDate,
            endDate,
            projectCost,
            // MODIFIED: Destructure 'supervisorId' (singular) for the primary supervisor
            supervisorId,
            supervisorId2, // Added for update
            supervisorId3, // Added for update
            status, // Include status in update
            isActive,
            description // Included description for update
        } = req.body;

        // Ensure supervisor IDs are parsed
        // Use 'supervisorId' for the first one as sent by frontend
        const parsedSupervisorId = supervisorId ? parseInt(supervisorId, 10) : null;
        const parsedSupervisorId2 = supervisorId2 ? parseInt(supervisorId2, 10) : null;
        const parsedSupervisorId3 = supervisorId3 ? parseInt(supervisorId3, 10) : null;


        // Fetch existing project to get current file paths if files are not being updated
        const currentProjectQuery = `SELECT * FROM hp.project_grid WHERE pg_project_id = $1;`;
        const currentProjectResult = await client.query(currentProjectQuery, [projectId]);
        const existingProject = currentProjectResult.rows[0];

        if (!existingProject) {
            return res.status(404).json({ success: false, message: "Project not found for update." });
        }

        // Handle file updates (if files are sent via a new form submission with file fields)
        const bimFilePath = req.files && req.files['bimFilePath'] ? req.files['bimFilePath'][0].path : existingProject.pg_bim_file_path;
        const floorPlanFilePath = req.files && req.files['floorPlanFilePath'] ? req.files['floorPlanFilePath'][0].path : existingProject.pg_floor_plan_file_path;
        const designFilePath = req.files && req.files['designFilePath'] ? req.files['designFilePath'][0].path : existingProject.pg_design_file_path;

        // Clean up old files if new ones are uploaded (add more robust logic if needed)
        // This is a basic example; consider adding checks if oldFile and newFile are actually different
        // and if oldFile path exists before unlinking.
        if (req.files && req.files['bimFilePath'] && existingProject.pg_bim_file_path && existingProject.pg_bim_file_path !== bimFilePath) {
            await fsPromises.unlink(existingProject.pg_bim_file_path).catch(err => console.error('Failed to delete old BIM file:', err));
        }
        if (req.files && req.files['floorPlanFilePath'] && existingProject.pg_floor_plan_file_path && existingProject.pg_floor_plan_file_path !== floorPlanFilePath) {
            await fsPromises.unlink(existingProject.pg_floor_plan_file_path).catch(err => console.error('Failed to delete old Floor Plan file:', err));
        }
        if (req.files && req.files['designFilePath'] && existingProject.pg_design_file_path && existingProject.pg_design_file_path !== designFilePath) {
            await fsPromises.unlink(existingProject.pg_design_file_path).catch(err => console.error('Failed to delete old Design file:', err));
        }


        const query = `
            UPDATE hp.project_grid
            SET
                pg_project_name = COALESCE($1, pg_project_name),
                pg_pin_code = COALESCE($2, pg_pin_code),
                pg_latitude = COALESCE($3, pg_latitude),
                pg_longitude = COALESCE($4, pg_longitude),
                pg_project_type = COALESCE($5, pg_project_type),
                pg_land_area = COALESCE($6, pg_land_area),
                pg_construction_area = COALESCE($7, pg_construction_area),
                pg_num_floors = COALESCE($8, pg_num_floors),
                pg_num_rooms = COALESCE($9, pg_num_rooms),
                pg_num_kitchens = COALESCE($10, pg_num_kitchens),
                pg_customer_phone = COALESCE($11, pg_customer_phone),
                pg_start_date = COALESCE($12, pg_start_date),
                pg_end_date = COALESCE($13, pg_end_date),
                pg_project_cost = COALESCE($14, pg_project_cost),
                pg_supervisor_id = COALESCE($15, pg_supervisor_id),
                pg_bim_file_path = COALESCE($16, pg_bim_file_path),
                pg_floor_plan_file_path = COALESCE($17, pg_floor_plan_file_path),
                pg_design_file_path = COALESCE($18, pg_design_file_path),
                pg_status = COALESCE($19, pg_status),
                pg_is_active = COALESCE($20, pg_is_active),
                pg_description = COALESCE($21, pg_description), -- Added description
                pg_supervisor2_id = COALESCE($22, pg_supervisor2_id), -- Added supervisor2 for update
                pg_supervisor3_id = COALESCE($23, pg_supervisor3_id), -- Added supervisor3 for update
                pg_updated_date = CURRENT_TIMESTAMP
            WHERE pg_project_id = $24
            RETURNING *;
        `;

        const values = [
            projectName || existingProject.pg_project_name,
            pinCode || existingProject.pg_pin_code,
            latitude ? parseFloat(latitude) : existingProject.pg_latitude,
            longitude ? parseFloat(longitude) : existingProject.pg_longitude,
            projectType || existingProject.pg_project_type,
            landArea ? parseFloat(landArea) : existingProject.pg_land_area,
            constructionArea ? parseFloat(constructionArea) : existingProject.pg_construction_area,
            numFloors ? parseInt(numFloors, 10) : existingProject.pg_num_floors,
            numRooms ? parseInt(numRooms, 10) : existingProject.pg_num_rooms,
            numKitchens ? parseInt(numKitchens, 10) : existingProject.pg_num_kitchens,
            customerPhone || existingProject.pg_customer_phone,
            startDate || existingProject.pg_start_date,
            endDate || existingProject.pg_end_date,
            projectCost ? parseFloat(projectCost) : existingProject.pg_project_cost,
            parsedSupervisorId || existingProject.pg_supervisor_id,
            bimFilePath,
            floorPlanFilePath,
            designFilePath,
            status || existingProject.pg_status,
            isActive !== undefined ? isActive : existingProject.pg_is_active,
            description || existingProject.pg_description, // Pass description
            parsedSupervisorId2 || existingProject.pg_supervisor2_id, // Pass supervisor2
            parsedSupervisorId3 || existingProject.pg_supervisor3_id, // Pass supervisor3
            projectId,
        ];

        console.log("SQL Update Query:", query);
        console.log("SQL Update Values:", values);

        const result = await client.query(query, values);

        if (result.rows.length > 0) {
            console.log("Project updated successfully:", result.rows[0]);
            res.status(200).json({ success: true, project: result.rows[0] });
        } else {
            console.log("Project not found for update:", projectId);
            res.status(404).json({ success: false, message: "Project not found" });
        }
    } catch (error) {
        console.error("--- Error updating project ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        console.log("--- Project Update API Call Finished ---");
    }
});

// Endpoint to delete a project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        console.log("--- Project Delete API Call Initiated (hp.project_grid) ---");
        const projectId = req.params.id;

        // First, get the file paths associated with the project to delete them from disk
        const getFilePathsQuery = `
            SELECT pg_bim_file_path, pg_floor_plan_file_path, pg_design_file_path
            FROM hp.project_grid
            WHERE pg_project_id = $1;
        `;
        const filePathsResult = await client.query(getFilePathsQuery, [projectId]);
        const filePaths = filePathsResult.rows[0];

        const deleteQuery = `DELETE FROM hp.project_grid WHERE pg_project_id = $1 RETURNING pg_project_id;`;
        const result = await client.query(deleteQuery, [projectId]);

        if (result.rows.length > 0) {
            // Delete associated files from disk if they exist
            if (filePaths) {
                const filesToDelete = [
                    filePaths.pg_bim_file_path,
                    filePaths.pg_floor_plan_file_path,
                    filePaths.pg_design_file_path
                ].filter(p => p && fs.existsSync(p)); // Filter out null/undefined and non-existent paths

                await Promise.all(filesToDelete.map(filePath =>
                    fsPromises.unlink(filePath).catch(err => console.error(`Failed to delete file ${filePath} from disk:`, err))
                ));
            }

            console.log(
                "Project deleted successfully:",
                result.rows[0].pg_project_id
            );
            res
                .status(200)
                .json({
                    success: true,
                    id: result.rows[0].pg_project_id,
                    message: "Project deleted successfully",
                });
        } else {
            console.log("Project not found for deletion:", projectId);
            res.status(404).json({ success: false, message: "Project not found" });
        }
    } catch (error) {
        console.error("--- Error deleting project ---");
        console.error("Error details:", error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        console.log("--- Project Delete API Call Finished ---");
    }
});


// Architects
app.get('/api/Architects', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT ar_id, ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_status
      FROM HP.manage_architects  
      ORDER BY ar_id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching architects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add Architects
app.post("/api/architects-add", async (req, res) => {
  const { first_name, last_name, phone_number, location, status } = req.body;

  // Basic validation
  if (!first_name || !phone_number || !location) {
    return res.status(400).json({ error: "First Name, phone number, and location are required." });
  }

  try {
    const ar_status = status === "Active" ? true : false;
    const result = await client.query(
      `INSERT INTO HP.manage_architects (ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_is_active, ar_created_at, ar_updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING ar_id, ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_is_active;`,
      [first_name, last_name, phone_number, location, ar_status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding architect:", err);

    // --- Add specific error handling for unique constraints here ---
    if (err.code === '23505') { // PostgreSQL unique violation error code
      if (err.detail.includes('manage_architects_ar_phone_number_key')) { // Replace with actual constraint name
        return res.status(400).json({ error: "Failed to add architect: A user with this phone number already exists." });
      }     
    }   
    res.status(500).json({ error: "Failed to add architect", details: err.message });
  }
});

// UPDATE - Edit existing Architects
// Backend Route: PUT (Update) an existing architect
app.put('/api/architects/:id', async (req, res) => {
  try {
    const architectId = req.params.id; // Get ID from URL parameter
    // Destructure request body using the EXACT keys sent from frontend
    const {
      ar_first_name,
      ar_last_name,
      ar_phone_number,
      ar_location,
      ar_is_active, // Expected as boolean true/false
      ar_status     // Expected as string like "Active", "Inactive"
    } = req.body;

    console.log(`\n--- Receiving PUT request to /api/architects/${architectId} ---`);
    console.log("Request Body Received for Update:", req.body); // <-- CHECK THIS OUTPUT IN YOUR BACKEND CONSOLE!

    // Basic server-side validation
    if (!ar_first_name || !ar_phone_number || !ar_location || typeof ar_is_active !== 'boolean' || !ar_status) {
      return res.status(400).json({ message: 'Missing required fields or invalid type for status.' });
    }

    const result = await client.query( // 'con' is used here!
      `UPDATE HP.manage_architects
           SET
             ar_first_name = $1,
             ar_last_name = $2,
             ar_phone_number = $3,
             ar_location = $4,
             ar_is_active = $5,
             ar_status = $6,
             ar_updated_at = NOW()
           WHERE ar_id = $7
           RETURNING ar_id, ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_is_active, ar_status;`,
      // Order of values must match the order of $1, $2, etc. in the query
      [ar_first_name, ar_last_name, ar_phone_number, ar_location, ar_is_active, ar_status, architectId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Architect not found' });
    }
    res.json(result.rows[0]); // Send back the updated row
  } catch (err) {
    console.error("Error in /api/architects/:id PUT:", err); // Specific log
    res.status(500).json({ error: "Failed to update architect", details: err.message });
  }
});

// delete Architects
app.delete("/api/Architects-Delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(`UPDATE HP.manage_architects SET ar_is_active = false, ar_updated_at = NOW() WHERE ar_id = $1`, [id]);
    if (result.rowCount === 0) {
      // It's good to return a 404 if no row was updated/found for that ID
      return res.status(404).json({ error: "Architect not found or already inactive." });
    }
    // 204 No Content is standard for successful DELETE operations that don't return data
    res.status(204).send();
  } catch (err) { // Consistent error variable name 'err'
    // FIX HERE: Corrected typo 'cconsole' to 'console' and used 'err' consistently
    console.error("Error in /api/Architects-Delete DELETE:", err);
    res.status(500).json({ error: "Failed to delete architect", details: err.message }); // Add details for debugging
  }
});


// Simple health check
app.get("/", (req, res) => {
  res.send("API running");
});
// Project Routes
// --- Start Server ---
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
// const PORT = 8080;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Backend API running on http://localhost:${PORT}`);
// });

// Project Routes
// --- Start Server ---
// const PORT = 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Backend API running on http://localhost:${PORT}`);
// });
// const PORT = process.env.PORT || 5000; // Use 5000 as a fallback for local Docker Compose

// app.listen(PORT, '0.0.0.0', () => { // Listen on all network interfaces
//   console.log(`Backend API running on http://0.0.0.0:${PORT}`);
// });
