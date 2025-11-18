# App Flow Document

## Onboarding and Sign-In/Sign-Up

When a new user first visits the Admin Panel, they land on a simple marketing or welcome page that briefly explains the purpose of the panel. At the top right corner, they see options to either sign in or sign up. If they choose to sign up, they are taken to the sign-up page where they can enter their email address, choose a password, and confirm the password. Alternatively, they can click the “Continue with Google” button, triggering a redirect to Google’s OAuth consent screen. After granting permission, they return to the Admin Panel with their account created and a session cookie set. For signing in, users can enter their email and password on the sign-in page or click the Google button again. Once their credentials are verified by the NestJS backend, they receive a JSON Web Token stored in an HTTP-only cookie. From any page, the user can click “Sign Out” in the header’s profile menu to clear the cookie and return to the sign-in screen. If the user forgets their password, they can click “Forgot Password,” which leads to a page requesting their email. Submitting that form sends a password reset link. The user follows the link to a secure page where they can set a new password, and upon success they are redirected back to the sign-in page to log in with their new credentials.

## Main Dashboard or Home Page

After a successful sign-in, the user is taken to the dashboard at `/dashboard`. On the left side of the screen, a vertical sidebar displays sections labeled Products, Categories, Orders, Reports, and Settings. The top of the page shows a header bar containing the application logo, the current page title, a notification icon, and a user avatar that opens a small dropdown when clicked. The main content area of the dashboard defaults to a set of summary cards showing total products, total orders, recent revenue figures, and low-stock alerts. A button in the header labeled “Add New” adapts its label to the current section and opens a form modal. The sidebar allows users to switch between the various management sections by clicking the desired label.

## Detailed Feature Flows and Page Transitions

### Product Management

When the user clicks “Products” in the sidebar, the main area displays a paginated table of existing products. Each row shows the product name, SKU, stock quantity, price, and an action menu with Edit and Delete. To add a new product, the user clicks the “Add Product” button in the header. This opens a full-page form with fields for name, description, price, stock, category selection, image upload, and an optional SKU override. As the user types, inline validation highlights any missing required fields. After completing the form and clicking “Save,” the data is sent to the NestJS API. On success, the panel shows a success toast and returns to the product table with the new product listed at the top. Editing a product follows a similar flow: clicking Edit on a row navigates to `/dashboard/products/[id]/edit`, preloads the product details into the form, and allows changes. Upon saving, the user sees a confirmation message and is returned to the list view. If the API returns an error, the form shows the error message at the top and highlights the problematic input.

### Category Management

Selecting “Categories” in the sidebar transitions the main area to a simple list of categories. The user can click “Add Category,” which opens a modal form to enter the category name and description. Submitting that form calls the API to create the new category. The view automatically refreshes to include the new category. Clicking on an existing category name takes the user to an edit page similar to the add modal, where they can update or delete the category.

### Order Management

By choosing “Orders” in the sidebar, the panel shows a list of customer orders with columns for order number, customer name, date, total amount, and status. The user can filter orders by status using a dropdown in the header. Clicking on an order row navigates to `/dashboard/orders/[orderId]` where a detailed view shows line items, shipping address, payment method, and a status dropdown. The admin can change the order status from Pending to Shipped or Completed, then click “Update Status.” A network call updates the order in the backend, and a confirmation message appears. If the call fails due to network issues, an inline error appears with a retry button.

### Reports Viewing

When the user selects “Reports,” the main content switches to a page with tabs for Sales, Inventory, and Customer Activity. Each tab displays charts and tables generated from API-fetched data. Filters at the top allow date range selection and category filtering. Changing filter values triggers a new API call and updates the visualizations. If data fails to load, an error banner appears with guidance to retry or contact support.

## Settings and Account Management

Clicking “Settings” in the sidebar opens the account settings page. The first section displays personal information fields such as name and email, which can be updated and saved. Below that is a “Change Password” form requiring the current password, new password, and confirmation. After successfully updating either personal details or password, a toast notification confirms the change. A second tab within Settings provides notification preferences where the user can toggle email alerts for new orders, low stock warnings, and system messages. Upon saving preferences, a success message appears. A link at the bottom directs the user back to the main dashboard.

## Error States and Alternate Paths

If a user enters invalid credentials on the sign-in page, a red error message appears explaining the problem. During sign-up, missing or mismatched passwords trigger inline warnings next to the affected fields. When the user tries to access any `/dashboard` route without being authenticated, they are redirected to sign-in. If their session expires while browsing, any API request that returns a 401 status code will automatically log them out and redirect to the sign-in page with a message that the session has expired. On the product or order pages, network failures display a banner with a retry option. Attempting to visit a non-existent route shows a custom 404 page with a link back to the dashboard. If a user without Admin privileges somehow reaches a protected route, the backend returns a 403 response and the frontend displays an “Access Denied” page offering to return to the dashboard or sign out.

## Conclusion and Overall App Journey

From the moment a user discovers the Admin Panel and signs up or logs in, they are guided through a clear set of pages and forms. Their first view after authentication is the dashboard summary, and they can easily navigate to manage products, categories, orders, and reports using the sidebar. Each section features list views, detail pages, and forms that fetch data from or submit changes to the NestJS backend. Account settings let them update their personal information and password, and any error along the way provides clear feedback and recovery paths. Daily usage flows smoothly from reviewing new orders to updating inventory and viewing sales performance, all within a secure, role-based interface that always returns the user to the dashboard home when completed.