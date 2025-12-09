# Sales Management System - TruEstate Assignment

## 1. Overview
A high-performance full-stack dashboard designed to manage and visualize large retail sales datasets (800,000+ records). It features a responsive "Vault-themed" UI with advanced server-side capabilities, including simultaneous multi-filtering, custom date-range selection, and optimized data ingestion using streams. The system is built to handle heavy data loads without compromising frontend performance.

## 2. Tech Stack
* **Frontend:** React (Vite), Tailwind CSS, Lucide React, Axios
* **Backend:** Node.js, Express.js, MongoDB (Mongoose)
* **Data Processing:** `csv-parser` (Stream-based processing for large files)
* **Architecture:** Layered Architecture (Controller-Service-Model)

## 3. Search Implementation Summary
Search is implemented efficiently to handle partial matches across multiple fields.
* **Frontend:** Implements a debounce mechanism (300ms) to prevent excessive API calls while typing.
* **Backend:** Uses MongoDB’s `$or` operator with `$regex` (case-insensitive) to search both `customer_name` and `phone` fields simultaneously.

## 4. Filter Implementation Summary
The system supports complex, additive multi-filtering logic handled via a robust Backend Service layer.
* **Dynamic Options:** Filter dropdowns (Regions, Categories, Tags) are populated dynamically by fetching distinct values from the database.
* **Multi-Select:** Users can select multiple values (e.g., "North" AND "South") using a custom Checkbox Dropdown component.
* **Complex Logic:**
    * **Age:** Parses strings like "18-25" into database queries (`$gte: 18, $lte: 25`).
    * **Date Range:** Implements a custom "From-To" picker that filters records between specific `startDate` and `endDate`.

## 5. Sorting Implementation Summary
Sorting is dynamic and preserves all currently active search and filter states.
* **Options:** Customer Name (A-Z), Date (Newest), and Quantity (High-Low).
* **Backend:** Uses Mongoose `.sort()` based on the `sortBy` query parameter.
* **UI:** Implemented via a clean dropdown that auto-adjusts width based on selection.

## 6. Pagination Implementation Summary
To handle large datasets (800k+ rows), we implemented Server-Side Pagination with a stable UI.
* **Backend:** Uses `.skip()` and `.limit(10)` to send only necessary data, preventing memory overload.
* **Frontend UI:** Implements "Batch Pagination" (e.g., showing pages [1, 2, 3, 4, 5], then switching to [6, 7, 8, 9, 10]). This prevents the pagination bar from "jittering" or sliding under the cursor, offering a superior user experience compared to standard sliding windows.
* **UX:** Includes Skeleton Loaders to prevent layout shifts during page transitions.

## 7. Setup Instructions

### Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas)

### Step 1: Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `backend/` and add your MongoDB URI:
    ```env
    MONGO_URI=mongodb://localhost:27017/sales_db
    PORT=5000
    ```
4.  **Seeding Data (Large Dataset):**
    Place your `source_data.csv` in `src/utils/` and run the high-memory script:
    ```bash
    node --max-old-space-size=4096 src/utils/seedData.js
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```

### Step 2: Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `frontend/`:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the application:
    ```bash
    npm run dev
    ```