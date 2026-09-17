# Preventing Duplicate Projects with Cosine Similarity in Cloud SQL for MySQL 8

Ever tried launching a new project, only to realize halfway through that another team down the hall built the exact same thing six months ago?

Duplicate projects are a silent tax on engineering teams. But if you’re running your application on Google Cloud SQL with MySQL 8, you don’t need to migrate to a brand-new vector database just to stop double-work before it starts.

Here is how to build an AI-powered "similarity guard" right inside your existing MySQL setup.

---

### First, a Quick Reality Check: GCP MySQL 8 vs. Community MySQL 8

If you try to run vector search on a standard, open-source MySQL 8.0 server, you’ll hit a wall. Standard MySQL 8 doesn't support vector data types—that feature only arrived natively in MySQL 9.0.

However, Google Cloud SQL bridges this gap. GCP adds a proprietary extension (`cloudsql_vector`) to MySQL 8.0.36+ that allows you to store vectors using a `VECTOR(...) USING VARBINARY` definition and query them using similarity functions like `approx_distance()`.

If you're self-hosting vanilla MySQL 8, you would have to compute these vector distances manually in your application layer. But on Cloud SQL, the database engine handles the heavy math for you.

---

### The Goal: Block Similar Projects at Submission

Imagine a project manager opening a form, filling out a title, a scope, and a list of deliverables, and clicking **Submit**.

Instead of blindly saving the entry, your system should read the new project's overall context, compare it against every existing project in your database, and raise a flag if someone is trying to reinvent the wheel.

Here is how you set that up step-by-step.

```
[Project Manager Fills Form]
       │
       ▼
[Concatenate Title + Scope + Deliverables]
       │
       ▼
[Generate Vector via Embedding Model (e.g., Vertex AI)]
       │
       ▼
[Cloud SQL Cosine Distance Search] ──(Find Closest Match)
       │
       ├─► Distance < 0.12 (Too Similar)  ──► [BLOCK & WARN USER]
       │
       └─► Distance >= 0.12 (Unique Enough) ──► [INSERT INTO DATABASE]

```

#### Step 1: Create the Table with Vector Support

First, set up your `projects` table. Notice the `overall_embedding` column—this is where your proprietary Cloud SQL vector type comes into play.

```sql
CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    scope TEXT,
    deliverables TEXT,
    overall_embedding VECTOR(768) USING VARBINARY
);

```

#### Step 2: Build an Index for Fast Lookups

As your project count grows into the thousands, scanning every row for every new submission will slow down. Create an Approximate Nearest Neighbor (ANN) index set to measure **Cosine Similarity** to keep lookups sub-second.

```sql
CREATE VECTOR INDEX idx_project_similarity ON projects(overall_embedding)
USING SCANN QUANTIZER = SQ8 DISTANCE_MEASURE = COSINE;

```

#### Step 3: Intercept the Submission in Your App

When the project manager hits "Submit," your backend application steps in before touching the database:

1. **Combine the Text:** Merge the fields into a single block of text:
   `"Title: Customer Dashboard | Scope: Build a real-time analytics UI | Deliverables: React frontend, chart widgets"`
2. **Convert to a Vector:** Pass that text string to your embedding model (like Vertex AI's `text-embedding-004`) to generate a 768-dimension numeric array representing the project's true semantic meaning.

#### Step 4: Run the Cosine Similarity Guard

Now, query your Cloud SQL database to find the closest existing project. Passing `distance_measure=cosine` tells MySQL to calculate how far apart the two project concepts are.

```sql
SELECT
    title,
    approx_distance(overall_embedding, string_to_vector('[NEW_PROJECT_VECTOR]'), 'distance_measure=cosine') AS similarity_score
FROM
    projects
ORDER BY
    similarity_score ASC
LIMIT 1;

```

#### Step 5: Evaluate the Score and Decision

In cosine distance calculations, **smaller numbers mean higher similarity** (a score of `0` means identical concepts).

Your backend reads the `similarity_score` returned by MySQL:

- **Score is below your safety threshold (e.g., `< 0.12`):**
  **Block the submission.** Show a warning in the UI: _"Wait! This project overlaps heavily with an existing project: '[Matching Project Title]'. Please review it before creating a new entry."_
- **Score is above the threshold (e.g., `>= 0.12`):**
  **Pass.** Run your standard `INSERT` query to store the project along with its new embedding vector.

---

### Wrapping Up

By leveraging Google Cloud SQL's vector extension on MySQL 8, you don't need to spin up separate infrastructure or manage third-party vector databases. With just a single vector column, a cosine index, and a simple backend check, you can build an automated safeguard that keeps your organization's projects lean and focused.
