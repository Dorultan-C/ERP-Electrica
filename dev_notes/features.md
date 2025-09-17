# ERP App – Features & Layout Document

# 1. Overall Structure

- The application is organized into **modules**.

- A **module navigation button** (grid icon in the top-left corner of the header) provides access to all modules.  
  - Clicking the button opens a **full-screen menu** displaying a grid of modules.  
  - Each module is represented by a **large icon** with its title beneath it.  
  - When the menu is open, the grid icon is replaced by a **close button**.  
  - The header always displays the **title of the active module**.

- To the right of the module navigation button is the **Dashboard button**.  
  - The Dashboard is independent of modules and provides a **summary view** of data and quick actions.  
  - It is displayed as a **customizable masonry grid** of widgets.  
  - Users can **add, remove, and rearrange widgets** as needed. Dashboard layout is persistant accross sessions.
  - The sections navigation side drawer is not present in the dashboard.

- Each module contains **sections**, accessible via a **side drawer**.  
  - When collapsed, the drawer displays only **icons** for each section.  
  - When expanded, it shows both **icons and titles**.

- On the far right of the header is the **profile button** (a circular user image).  
  - Clicking it opens a dropdown menu with options such as:  
    - Personal Details  
    - Settings  
    - Logout  

- To the left of the profile button is the **notifications button** with a **badge counter**.  
  - Clicking it opens a dropdown showing the **latest notifications**.  
  - A **“Mark all as seen”** icon is displayed at the top of the dropdown.  
  - If the user has many notifications, a **“Show all”** button appears at the bottom.  

- **Permissions** govern access across the application.  
  - Modules, sections, features, and buttons are only visible to users with the required permissions.

---

## 2. Core Modules

### 2.1 Settings

#### 2.1.1 Sections

- **Company:** Manage company-related information and settings.  
- **App:** Manage application-wide information and settings.

---

### 2.2 Human Resources (HR)

#### 2.2.1 Sections

- **Users:**  
  - Displays a list of all users in the application.  
  - Includes a button to **add new users**.  
  - Selecting a user opens a **right-side drawer** with user details and actions.  
  - The drawer also provides an **edit button** for updating user information.  
  - The list is **searchable, filterable, and sortable**.
  - List items include relevant **quick-action buttons**.

- **Vacations:**  
  - Displays multiple vacation lists separated into **Past**, **Future**, **Ongoing**, and **Action Required**.  
  - All lists share the same **search, filter, and sort options**.  
  - List items include relevant **quick-action buttons**.  
  - Selecting a vacation opens a **right-side drawer** with details and actions.  
  - Includes a button to **request vacation** (form opens in the right-side drawer).  
  - Lists are **collapsible**.  
  - Options exist to add **public holidays** and **closing days** (mandatory vacations for all employees).

- **Leave of Absence (LOA):**  
  - Displays lists of LOAs separated into **Past**, **Future**, **Ongoing**, and **Action Required**.  
  - All lists share the same **search, filter, and sort options**.  
  - List items include relevant **quick-action buttons**.  
  - Selecting an LOA opens a **right-side drawer** with details and actions.  
  - Includes a button to **request LOA** (form opens in the right-side drawer).  
  - Lists are **collapsible**.

- **Attendance:**  
  - Displays timesheets for the selected **day, month, or year**.  
  - The list is **searchable, filterable, and sortable**.  
  - List items include **quick-action buttons**.  
  - Selecting a timesheet opens a **right-side drawer** with details and actions.  
  - Above the main list, a separate **“Action Required” list** highlights timesheets that are missing, pending approval pending modification... 
  - The **“Action Required” list** is **collapsible**.

- **Schedules:**  
  - Displays list of employee weekly schedules, including **working hours** and **breaks**.  
  - Provides options to **add, edit, delete, search, filter, and sort** schedules.  
  - Schedules can be assigned to **individual employees**.
  - Selecting a schedule opens a **right-side drawer** with details and actions. 
  - List items include relevant **quick-action buttons**.

---

### 2.2  Projects

cooming soon... 

---

### 2.3 Finance

cooming soon...   

---

### 2.4 Inventory

cooming soon...  

---

### 2.4 Files

cooming soon...  

---

## 3. Cross-Module Features

cooming soon... 

---

# MORE MODULES TO BE ADDED LATER #
