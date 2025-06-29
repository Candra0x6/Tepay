# Authentication Canister

The Authentication canister provides user authentication and profile management services for the Tepay platform. It handles user registration, profile storage, and basic authentication services.

## Overview

- **File**: `auth.mo`
- **Purpose**: Manage user authentication and profile data
- **Status**: Basic implementation - can be extended for advanced features

## Features

- User profile registration and storage
- Principal-based authentication
- Profile retrieval by Principal ID
- Basic greeting functionality
- Identity verification

## Data Structures

### UserProfile
```motoko
public type UserProfile = {
    principal : Principal;
    createdAt : Time.Time;
    lastLogin : ?Time.Time;
};
```

### AuthError
```motoko
public type AuthError = {
    #NotAuthorized;
    #ProfileNotFound;
    #AlreadyExists;
    #SessionExpired;
    #InvalidToken;
    #OperationFailed;
};
```

## State Management

The canister maintains:
- **userProfiles**: TrieMap storing user profiles indexed by Principal ID

## Public API

### Basic Functions

#### Greet
```motoko
public shared func greet(name : Text) : async Text
```

Simple greeting function for testing connectivity.

**Parameters:**
- `name`: Name to include in greeting

**Returns:** Formatted greeting message

**Example:**
```motoko
let message = await auth.greet("Alice");
// Returns: "Hello, Alice!"
```

#### Who Am I
```motoko
public shared (msg) func whoami() : async Principal
```

Returns the Principal ID of the caller.

**Returns:** Caller's Principal ID

**Example:**
```motoko
let my_principal = await auth.whoami();
```

### User Management

#### Register User
```motoko
public shared (msg) func registerUser() : async Result.Result<UserProfile, AuthError>
```

Registers a new user profile for the caller.

**Returns:** Result containing the created UserProfile or an error

**Success Response:**
```motoko
#ok({
    principal = caller_principal;
    createdAt = current_timestamp;
    lastLogin = null;
})
```

**Example:**
```motoko
let result = await auth.registerUser();
switch (result) {
    case (#ok(profile)) {
        // User registered successfully
        let user_principal = profile.principal;
    };
    case (#err(error)) {
        // Handle registration error
    };
};
```

#### Get User by Principal
```motoko
public shared (_msg) func getUserByPrincipal(principal : Principal) : async ?UserProfile
```

Retrieves a user profile by Principal ID.

**Parameters:**
- `principal`: Principal ID of the user to retrieve

**Returns:** UserProfile if found, null otherwise

**Example:**
```motoko
let profile = await auth.getUserByPrincipal(user_principal);
switch (profile) {
    case (?user) {
        let creation_time = user.createdAt;
        let last_login = user.lastLogin;
    };
    case null {
        // User not found
    };
};
```

## Usage Examples

### User Registration Flow
```motoko
// 1. Check if user exists
let existing_user = await auth.getUserByPrincipal(caller_principal);

switch (existing_user) {
    case (?user) {
        // User already exists
        return #err(#AlreadyExists);
    };
    case null {
        // 2. Register new user
        let result = await auth.registerUser();
        switch (result) {
            case (#ok(profile)) {
                // 3. User registered successfully
                // Continue with application logic
            };
            case (#err(error)) {
                // Handle error
            };
        };
    };
};
```

### Identity Verification
```motoko
// Verify caller identity
let caller_id = await auth.whoami();

// Get caller's profile
let profile = await auth.getUserByPrincipal(caller_id);
```

## Integration Points

### With Other Canisters
The Authentication canister can be integrated with other platform canisters:

```motoko
// In another canister
import Auth "canister:auth";

public shared(msg) func protected_function() : async Result<Text, Text> {
    let caller = msg.caller;
    
    // Verify user is registered
    let profile = await Auth.getUserByPrincipal(caller);
    switch (profile) {
        case (?user) {
            // User is authenticated, proceed
            #ok("Operation successful")
        };
        case null {
            #err("User not registered")
        };
    };
};
```

### Frontend Integration
Frontend applications can use the authentication canister for:

- User onboarding and registration
- Identity verification
- Profile management
- Session management (with extensions)

## Security Considerations

### Current Implementation
- **Principal-based Authentication**: Uses Internet Computer's built-in Principal authentication
- **No Session Management**: Relies on IC's caller identity for each request
- **Profile Privacy**: All profiles are queryable by any caller

### Recommended Enhancements
For production use, consider implementing:

1. **Access Controls**: Restrict profile access to owners or authorized parties
2. **Session Management**: Implement session tokens for enhanced security
3. **Profile Permissions**: Add role-based access control
4. **Login Tracking**: Update lastLogin timestamp on user interactions
5. **Profile Validation**: Add input validation for profile data

## Potential Extensions

### Enhanced Profile Management
```motoko
// Extended UserProfile
public type ExtendedUserProfile = {
    principal : Principal;
    username : ?Text;
    email : ?Text;
    avatar : ?Text;
    preferences : {
        notifications : Bool;
        privacy_level : Nat8;
    };
    createdAt : Time.Time;
    lastLogin : ?Time.Time;
    loginCount : Nat;
};
```

### Role-Based Access Control
```motoko
public type UserRole = {
    #User;
    #Admin;
    #Moderator;
};

public type UserProfile = {
    // ... existing fields
    role : UserRole;
    permissions : [Text];
};
```

### Session Management
```motoko
public type Session = {
    token : Text;
    principal : Principal;
    created_at : Time.Time;
    expires_at : Time.Time;
    active : Bool;
};

public shared(msg) func create_session() : async Result<Text, AuthError>;
public shared(msg) func validate_session(token : Text) : async Bool;
public shared(msg) func logout(token : Text) : async Bool;
```

## Testing

### Basic Functionality Tests
```motoko
// Test user registration
let result = await auth.registerUser();
assert(Result.isOk(result));

// Test identity verification
let principal = await auth.whoami();
assert(Principal.isAnonymous(principal) == false);

// Test profile retrieval
let profile = await auth.getUserByPrincipal(principal);
assert(Option.isSome(profile));
```

### Integration Tests
```motoko
// Test with multiple users
let user1 = await auth.registerUser();
let user2 = await auth.registerUser();

// Verify different principals
let p1 = await auth.whoami();
// Switch identity
let p2 = await auth.whoami();

assert(Principal.notEqual(p1, p2));
```

## Migration and Upgrades

The current implementation is minimal and can be safely upgraded to include additional features:

1. **Backward Compatibility**: New fields can be added as optional
2. **Data Migration**: Existing profiles can be migrated to new schema
3. **State Preservation**: TrieMap handles upgrade persistence automatically

## Error Handling

The canister defines comprehensive error types but currently only implements basic functionality. Full error handling should be implemented for:

- Profile creation failures
- Invalid Principal IDs
- Authorization failures
- Database access errors

## Performance Considerations

- **Profile Storage**: TrieMap provides O(log n) access time
- **Memory Usage**: Each profile is stored in canister memory
- **Scalability**: Consider implementing pagination for large user bases
- **Caching**: Profile data is automatically cached in memory

## Future Development

This canister serves as a foundation for a comprehensive authentication system. Consider implementing:

1. **Multi-factor Authentication**: Add additional verification methods
2. **Social Login**: Integration with external identity providers
3. **Profile Encryption**: Encrypt sensitive profile data
4. **Audit Logging**: Track authentication events
5. **Account Recovery**: Implement account recovery mechanisms
