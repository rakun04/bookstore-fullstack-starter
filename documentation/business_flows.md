# E-Commerce Book Store - Business Flow Diagrams

## 🛒 Checkout Flow

```mermaid
flowchart TD
    A[User adds books to cart] --> B[User clicks Checkout]
    B --> C[Authentication Check]
    C --> D{User logged in?}
    D -->|No| E[Login/Register Page]
    D -->|Yes| F[Checkout Page]
    E --> F

    F --> G[Select Shipping Address]
    G --> H[Select Shipping Method]
    H --> I[Apply Voucher Optional]
    I --> J[Select Payment Method]
    J --> K[Review Order Summary]
    K --> L{Confirm Order?}

    L -->|Cancel| M[Return to Cart]
    L -->|Confirm| N[Create Order]
    N --> O[Reserve Stock]
    O --> P[Calculate Total Amount]
    P --> Q[Process Payment]

    Q --> R{Payment Success?}
    R -->|Failed| S[Show Payment Error]
    R -->|Success| T[Update Order Status: PAID]

    S --> U[Retry Payment]
    U --> Q
    T --> V[Send Payment Confirmation Email]
    V --> W[Create Shipment Request]
    W --> X[Update Order Status: PROCESSED]
    X --> Y[Send Order Confirmation Email]
    Y --> Z[Show Order Success Page]

    Z --> AA[Track Order Status]
```

## 💳 Payment Flow

```mermaid
flowchart TD
    A[User selects payment method] --> B{Payment Type}

    B -->|QRIS| C[Generate QR Code]
    B -->|Virtual Account| D[Generate VA Number]
    B -->|E-Wallet| E[Redirect to E-Wallet]
    B -->|Credit Card| F[Enter Card Details]

    C --> G[Show QR Code to User]
    D --> H[Show VA Number to User]
    E --> I[Redirect Payment Gateway]
    F --> J[Process Card Payment]

    G --> K[User scans QR]
    H --> L[User transfers to VA]
    I --> M[User authorizes payment]
    J --> N[Card authorization]

    K --> O[Payment Gateway Webhook]
    L --> O
    M --> O
    N --> O

    O --> P[Verify Payment]
    P --> Q{Payment Valid?}

    Q -->|Invalid| R[Payment Failed]
    Q -->|Valid| S[Payment Success]

    R --> T[Notify User: Payment Failed]
    S --> U[Update Order: PAID]
    U --> V[Send Payment Confirmation]
    V --> W[Update Inventory]
    W --> X[Trigger Fulfillment Process]

    T --> Y[Retry Payment Option]
    Y --> A
```

## 🚚 Shipping Flow

```mermaid
flowchart TD
    A[Order Paid] --> B[Admin processes order]
    B --> C[Check inventory]
    C --> D{Stock Available?}

    D -->|No| E[Notify: Out of Stock]
    D -->|Yes| F[Package items]

    F --> G[Generate shipping label]
    G --> H[Select courier service]
    H --> I[Create shipment request]
    I --> J[Get tracking number]
    J --> K[Update order: SHIPPED]

    K --> L[Send shipping confirmation]
    L --> M[Handover to courier]
    M --> N[Courier picks up package]

    N --> O[Package in transit]
    O --> P[Real-time tracking updates]

    P --> Q{Delivered?}
    Q -->|No| R[Continue tracking]
    Q -->|Yes| S[Mark as delivered]

    R --> O
    S --> T[Update order: COMPLETED]
    T --> U[Send delivery confirmation]
    U --> V[Request customer review]
    V --> W[Update sales analytics]
```

## 📚 Product Management Flow

```mermaid
flowchart TD
    A[Admin adds new book] --> B[Enter book details]
    B --> C[Upload book images]
    C --> D[Set pricing and stock]
    D --> E[Select categories]
    E --> F[Review book information]

    F --> G{Information correct?}
    G -->|No| H[Edit book details]
    G -->|Yes| I[Save book]

    H --> B
    I --> J[Generate slug]
    J --> K[Update inventory]
    K --> L[Notify new book alert]
    L --> M[Book appears in catalog]

    M --> N[Book search index]
    N --> O[Category assignment]
    O --> P[Featured book selection]
    P --> Q[Available for sale]

    R[Stock management] --> S{Stock level}
    S -->|Low| T[Send low stock alert]
    S -->|Out| U[Mark as unavailable]
    S -->|Normal| V[Continue selling]

    T --> W[Admin restocks]
    U --> X[Remove from search results]
    W --> V
    X --> Y[Notify customers when back in stock]
```

## 🔐 Authentication Flow

```mermaid
flowchart TD
    A[User opens app] --> B{User logged in?}

    B -->|No| C[Show Login/Register options]
    B -->|Yes| D[Load user dashboard]

    C --> E{Authentication Method}
    E -->|Email/Password| F[Login with credentials]
    E -->|Google OAuth| G[Google authentication]
    E -->|Register| H[Create new account]

    F --> I[Validate credentials]
    G --> J[Google OAuth callback]
    H --> K[Validate registration data]

    I --> L{Credentials valid?}
    J --> M{Google token valid?}
    K --> N{Data valid?}

    L -->|No| O[Show error message]
    L -->|Yes| P[Generate JWT tokens]
    M -->|No| Q[Show Google error]
    M -->|Yes| P
    N -->|No| R[Show validation errors]
    N -->|Yes| S[Create user account]

    O --> F
    Q --> C
    R --> H
    S --> P
    P --> T[Store tokens securely]
    T --> U[Set authenticated state]
    U --> V[Navigate to dashboard]

    V --> W[Load user profile]
    W --> X[Check email verification]
    X --> Y{Email verified?}

    Y -->|No| Z[Show verification prompt]
    Y -->|Yes| AA[Full access granted]

    Z --> AB[Send verification email]
    AB --> AC[User verifies email]
    AC --> AA
```

## 📦 Inventory Management Flow

```mermaid
flowchart TD
    A[Book order received] --> B[Check current stock]
    B --> C{Stock sufficient?}

    C -->|No| D[Notify: Insufficient stock]
    C -->|Yes| E[Reserve stock]

    D --> F[Cancel order or backorder]
    E --> G[Decrement available stock]
    G --> H[Update inventory system]

    H --> I{Stock reaches threshold?}
    I -->|No| J[Continue normal flow]
    I -->|Yes| K[Trigger reorder alert]

    J --> L[Process shipment]
    K --> M[Notify purchasing team]
    M --> N[Create purchase order]
    N --> O[Supplier delivery]
    O --> P[Receive and verify shipment]
    P --> Q[Update stock levels]
    Q --> R[Notify staff: Stock replenished]

    R --> S[Update system inventory]
    S --> T[Resume normal operations]

    U[Regular stock audit] --> V[Compare system vs physical]
    V --> W{Discrepancies found?}
    W -->|No| X[Continue normal operations]
    W -->|Yes| Y[Investigate discrepancies]
    Y --> Z[Adjust system records]
    Z --> AA[Report findings]
    AA --> X
```

## 📊 Order Analytics Flow

```mermaid
flowchart TD
    A[Order completed] --> B[Collect order data]
    B --> C[Update analytics database]
    C --> D[Calculate metrics]

    D --> E[Revenue tracking]
    D --> F[Customer behavior analysis]
    D --> G[Product performance]
    D --> H[Inventory optimization]

    E --> I[Daily/Weekly/Monthly reports]
    F --> J[Customer segmentation]
    G --> K[Bestseller identification]
    H --> L[Reorder recommendations]

    I --> M[Management dashboard]
    J --> N[Marketing campaigns]
    K --> O[Promotion strategies]
    L --> P[Purchasing decisions]

    Q[Real-time monitoring] --> R[System performance]
    R --> S[Sales alerts]
    S --> T{Sales threshold reached?}

    T -->|No| U[Continue monitoring]
    T -->|Yes| V[Trigger celebration/promotion]

    V --> W[Notify stakeholders]
    W --> X[Update marketing materials]
    X --> Y[Social media announcements]
    Y --> Z[Press release if milestone]

    U --> Q
    Z --> Q
```

## 🔄 Return & Refund Flow

```mermaid
flowchart TD
    A[Customer requests return] --> B[Submit return reason]
    B --> C[Upload proof photos]
    C --> D[Submit return request]

    D --> E[Admin reviews request]
    E --> F{Return approved?}

    F -->|No| G[Reject with reason]
    F -->|Yes| H[Generate return label]

    G --> I[Notify customer]
    H --> J[Send return instructions]

    J --> K[Customer ships item back]
    K --> L[Item received at warehouse]
    L --> M[Inspect returned item]

    M --> N{Item condition acceptable?}
    N -->|No| O[Reject return/deduct fee]
    N -->|Yes| P[Process refund]

    O --> Q[Notify customer]
    P --> R[Initiate refund]
    R --> S[Refund processed]
    S --> T[Update order: RETURNED]
    T --> U[Restore inventory]
    U --> V[Send refund confirmation]
    V --> W[Update analytics]

    Q --> X[Customer can appeal]
    X --> Y[Admin reviews appeal]
    Y --> F

    I --> Z[End process]
    W --> Z
```

## 📈 Flash Sale Flow

```mermaid
flowchart TD
    A[Admin creates flash sale] --> B[Set sale parameters]
    B --> C[Select participating books]
    C --> D[Set discount percentages]
    D --> E[Set stock limits]
    E --> F[Set time duration]
    F --> G[Activate flash sale]

    G --> H[Notify customers]
    H --> I[Display on homepage]
    I --> J[Show countdown timer]

    K[Customer adds flash sale item] --> L{Stock available?}
    L -->|No| M[Show: Sold out]
    L -->|Yes| N[Add to cart with discount]

    N --> O[Quick checkout flow]
    O --> P[Reserve stock for X minutes]
    P --> Q[Customer must complete purchase]

    Q --> R{Purchase completed?}
    R -->|No| S[Release reserved stock]
    R -->|Yes| T[Update flash sale stock]

    S --> U[Available for others]
    T --> V[Decrement remaining stock]
    V --> W{Stock depleted?}

    W -->|No| X[Continue sale]
    W -->|Yes| Y[Mark as sold out]

    X --> Z{Time expired?}
    Y --> Z
    Z -->|No| L
    Z -->|Yes| AA[End flash sale]

    AA --> BB[Notify participants]
    BB --> CC[Generate sales report]
    CC --> DD[Analyze performance]
    DD --> EE[Plan next flash sale]
```

These business flow diagrams provide comprehensive visual representations of all major processes in the E-Commerce Book Store platform.