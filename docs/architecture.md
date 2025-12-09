# System Architecture - Retail Sales Dashboard

## 1. Backend Architecture
The backend is built on a **Layered Architecture** (Controller-Service-Model) to ensure separation of concerns, testability, and maintainability.

* **Layer 1: Routes (`src/routes`)**
    * Acts as the entry point for API requests.
    * Responsible for mapping HTTP methods (GET) to specific controller functions.
    * *Example:* Maps `/api/sales` to `salesController.getSales`.

* **Layer 2: Controllers (`src/controllers`)**
    * Handles incoming HTTP requests (`req`) and formulates responses (`res`).
    * Extracts query parameters (search, filters, pagination) from the URL.
    * Delegates all business logic to the **Service Layer**.
    * *Goal:* Keep controllers "skinny" and logic-free.

* **Layer 3: Services (`src/services`)**
    * Contains the core business logic.
    * **Query Builder:** Dynamically constructs complex MongoDB queries using `$and`, `$or`, and `$in` operators based on user filters.
    * **Data Fetching:** Executes parallel database operations (fetching data + counting total documents + aggregating stats) for performance.
    * *Example:* `salesService.js` handles the logic for overlapping date ranges and multi-select filtering.

* **Layer 4: Data Access / Models (`src/models`)**
    * Defines the Mongoose schema for the `Sale` entity.
    * Enforces data types (Strings, Numbers, Dates) and structure.

## 2. Frontend Architecture
The frontend is a **Component-Based** React application optimized for interactivity and performance.

* **Custom Hooks (`src/hooks`)**
    * **`useSalesData`**: Centralizes all API communication and state management. It handles `loading`, `error`, `data`, and `pagination` states, keeping UI components clean.
    
* **Component Strategy (`src/components`)**
    * **Atomic Design:** Uses small, reusable components like `MultiSelect.jsx` and `Skeleton.jsx`.
    * **Configuration-Driven UI:** Components like `FilterBar.jsx` use configuration arrays to render inputs dynamically, making the system highly scalable.

* **State Management**
    * Uses local React State (`useState`) lifted to the Page level (`Dashboard.jsx`) to coordinate filters, search, and pagination across sibling components.

## 3. Data Flow Diagram
The data flow follows a strict unidirectional path:

1.  **User Interaction:** User selects "North" Region and types "Neha" in Search.
2.  **State Update:** React updates state; Debounce logic waits 300ms.
3.  **Service Call:** Frontend `api.js` triggers GET request:
    `GET /api/sales?search=Neha&region=North`
4.  **Route Handling:** Express router forwards request to `salesController`.
5.  **Service Processing:**
    * `salesService` builds query: `{ $and: [{ region: 'North' }, { customer_name: /Neha/i }] }`.
    * Executes `Sale.find()` and `Sale.aggregate()` in parallel.
6.  **Response:** JSON data containing rows, total count, and discount stats is returned.
7.  **UI Update:** React re-renders `SalesTable` (rows) and `StatsMetrics` (cards).

## 4. Folder Structure
The project follows a standard monorepo structure separating concerns:

```text
TruEstate_Assignment/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection logic
│   │   ├── controllers/    # Request handlers (salesController.js)
│   │   ├── models/         # Database Schemas (Sale.js)
│   │   ├── routes/         # API Endpoint definitions
│   │   ├── services/       # Business Logic (salesService.js)
│   │   ├── utils/          # Helper scripts (seedData.js)
│   │   └── index.js        # Server entry point
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (FilterBar, SalesTable)
│   │   ├── hooks/          # Logic (useSalesData)
│   │   ├── pages/          # Layouts (Dashboard)
│   │   ├── services/       # API integration (api.js)
│   │   └── App.jsx
│   └── .env
└── docs/
    └── architecture.md

## 5. Module Responsibilities

### Search Module
* **Frontend:** Captures input, handles debouncing (300ms), and resets pagination on new search.
* **Backend:** Performs regex-based case-insensitive matching on `customer_name` and `phone`.

### Filter Module
* **Frontend:** `FilterBar` renders dynamic multi-select dropdowns based on options fetched from the DB.
* **Backend:** `salesService` constructs additive filters. Special logic handles:
    * **Age Range:** Converts "18-25" strings into numerical range queries.
    * **Date Range:** Filters records between `startDate` and `endDate`.

### Pagination Module
* **Strategy:** Server-Side Pagination.
* **Backend:** Uses `skip` and `limit` to return only 10 records per request, preventing memory overload with large datasets (800k+ rows).
* **Frontend:** Implements "Batch Pagination" logic (e.g., 1-5, 6-10) for a stable UI that doesn't shift layout during navigation.