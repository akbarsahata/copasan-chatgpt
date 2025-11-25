# How to Use Drizzle ORM in Your Node.js Project and Connect to a Supabase Database with pgBounce

---

![code-sql](https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1)

---

In modern web development, managing your database efficiently and ensuring optimized connections are crucial for building robust applications. This tutorial will guide you step-by-step through integrating Drizzle ORM into your Node.js project, while also establishing a connection to a Supabase database using pgBounce. By the end of this post, you'll have a clear understanding of setting up a performant database connection, which can improve the efficiency and scalability of your application.
 
### **What is Drizzle ORM?**

Drizzle ORM is a lightweight and type-safe ORM (Object-Relational Mapping) tool for JavaScript and TypeScript that simplifies database queries. Its flexibility, paired with its type safety, makes it an excellent choice for handling database operations in modern web applications.

### **Why Supabase and pgBounce?**

- **Supabase** is an open-source alternative to Firebase, offering a robust platform with a PostgreSQL database, real-time subscriptions, and authentication features.
- **pgBounce** is a lightweight connection pooler for PostgreSQL that helps manage and optimize database connections, reducing latency and improving performance, especially in scenarios where multiple clients are connecting simultaneously.

### **Step 1: Setting Up Your Node.js Project**

Start by creating a new Node.js project. Open your terminal and run the following commands:

```bash
# Create a new Node.js project
mkdir drizzle-supabase-pgbounce
cd drizzle-supabase-pgbounce
npm init -y

# Install required dependencies
npm install drizzle-orm pg dotenv
```

Here’s what each package does:
- `drizzle-orm`: The ORM that will manage your PostgreSQL database connections and queries.
- `pg`: PostgreSQL client for Node.js.
- `dotenv`: To load environment variables from a `.env` file, which will store your database credentials securely.

### **Step 2: Setting Up Supabase and pgBounce**

Before proceeding, you'll need to set up a Supabase account if you haven't already. After creating a project in Supabase, you'll have access to the necessary connection details.

In the Supabase dashboard, enable **pgBounce** by navigating to the database settings and enabling it under the connection pooler section. Once enabled, make note of your **connection string** for pgBounce.

### **Step 3: Configuring Environment Variables**

For security purposes, you'll store your database credentials in a `.env` file. Create this file in your project root directory:

```bash
touch .env
```

Add the following lines to your `.env` file, replacing the placeholders with your actual Supabase connection details:

```bash
# .env
SUPABASE_URL=<your-supabase-url>
SUPABASE_PASSWORD=<your-supabase-password>
SUPABASE_USER=<your-supabase-user>
SUPABASE_DATABASE=<your-database-name>
SUPABASE_PORT=<your-database-port>
```

### **Step 4: Initializing Drizzle ORM**

Now, let's configure Drizzle ORM and connect it to Supabase via pgBounce. Create a new `db.js` file to handle the database connection.

```javascript
// db.js
require('dotenv').config();
const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm');

// Setup the connection pool for pgBounce
const pool = new Pool({
  host: process.env.SUPABASE_URL,
  port: process.env.SUPABASE_PORT,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DATABASE,
  ssl: { rejectUnauthorized: false } // For SSL connections
});

// Initialize Drizzle ORM
const db = drizzle(pool);

module.exports = db;
```

Here’s a breakdown of the code:
- `Pool`: This comes from the `pg` package and is responsible for managing the connections to the Supabase database, passing through pgBounce.
- `drizzle(pool)`: This initializes Drizzle ORM with the connection pool you created.

### **Step 5: Defining Database Models with Drizzle**

In Drizzle ORM, you define your database structure using models. Let's create a basic `User` model.

Create a `models.js` file:

```javascript
// models.js
const { defineTable } = require('drizzle-orm');

// Define the User model
const User = defineTable('users', {
  id: 'serial primary key',
  name: 'text',
  email: 'text unique',
});

module.exports = { User };
```

This code defines a `User` table with `id`, `name`, and `email` fields.

### **Step 6: Performing Database Operations**

Now that your database and models are set up, let’s write some code to interact with the database. Create a `main.js` file and add some basic CRUD operations.

```javascript
// main.js
const db = require('./db');
const { User } = require('./models');

async function main() {
  // Insert a new user
  await db.insert(User, { name: 'John Doe', email: 'john@example.com' });

  // Fetch all users
  const users = await db.select(User);
  console.log('All Users:', users);

  // Update a user
  await db.update(User, { name: 'Jane Doe' }, { where: { id: 1 } });

  // Delete a user
  await db.delete(User, { where: { id: 1 } });
}

main().catch(console.error);
```

### **Step 7: Running the Application**

To run the application, simply execute the following command:

```bash
node main.js
```

Once executed, this script will:
1. Insert a new user into the database.
2. Fetch all users and log them to the console.
3. Update a user’s name.
4. Delete the user from the database.

### **Conclusion**

By integrating Drizzle ORM with a Supabase database and using pgBounce, you've set up a powerful, efficient, and optimized connection for your Node.js project. Drizzle ORM's type safety and lightweight nature make it ideal for managing your database, while pgBounce ensures smooth handling of multiple database connections, especially under heavy loads.

Incorporating these tools into your project can significantly enhance both performance and scalability, making them an excellent choice for developers building modern applications.