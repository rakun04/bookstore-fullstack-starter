flowchart TD

    Start[Start] --> SignIn[Navigate to sign in page]
    SignIn --> Submit[Fill and submit credentials]
    Submit --> CallAPI[Send credentials to NestJS API]
    CallAPI --> Validate{Valid credentials and Admin role}
    Validate -->|Yes| ReturnJWT[Receive JWT token]
    Validate -->|No| Error[Display error and retry]
    Error --> SignIn
    ReturnJWT --> Store[Store JWT in http only cookie]
    Store --> Redirect[Redirect to dashboard]
    Redirect --> Dashboard[Admin Dashboard]
    Dashboard --> Products[CRUD products]
    Dashboard --> Categories[CRUD categories]
    Dashboard --> Orders[Manage orders]
    Dashboard --> Reports[View reports]