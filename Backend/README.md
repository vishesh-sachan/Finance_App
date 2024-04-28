<h2>Finance App</h2>
<p>This is a finance app backend built with Express and Mongoose. It allows users to signup, login, create expense entries, and view their entries.</p>
<h3>Dependencies:</h3>
<ul>
<li>express</li>
<li>mongoose</li>
<li>zod</li>
<li>jsonwebtoken</li>
</ul>
<h3>Database:</h3>
<ul>
  <li>MongoDB</li>
</ul>
<h3>Features:</h3>
<ul>
  <li>User Signup: Creates a new user in the database.</li>
  <li>User Login: Authenticates users and generates a JWT token.</li>
  <li>Expense Entry: Creates a new expense entry for a specific user.</li>
  <li>View Entries: Retrieves all expense entries for a specific user.</li>
  <li>Delete Entry: Deletes a specific expense entry for a user (requires expense details).</li>
</ul>
<h3>Middleware:</h3>
<ul>
  <li>checkUserExists: Checks if a username already exists during signup.</li>
  <li>userAccess: Verifies user access through a JWT token in headers.</li>
  <li>login: Validates username and password during login.</li>
  <li>userInputValidator: Ensures valid user information during signup using Zod schema.</li>
  <li>entryInputValidator: Ensures valid expense entry data using Zod schema.</li>
  <li>app.use(express.json()): Parses incoming JSON requests.</li>
</ul>
<h3>Routes:</h3>
<ul>
  <li>POST /signup: Creates a new user.</li>
  <li>POST /login: Logs in a user and generates a JWT token.</li>
  <li>POST /entry: Creates a new expense entry for the authorized user</li>
  <li>GET /entries: Retrieves all expense entries for the authorized user.</li>
  <li>DELETE /delete: Deletes a specific expense entry for the authorized user.</li>
</ul>
<h3>Error Handling:</h3>
<p>The app uses informative error messages and appropriate HTTP status codes</p>
<h3>Running the App:</h3>
<ul>
  <li>Configure your MongoDB connection string in the mongoose.connect call.</li>
  <li>Ensure you have the required dependencies installed (npm install).</li>
  <li>Run the app using node backend.js.</li>
</ul>
