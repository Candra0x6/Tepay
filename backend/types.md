# Types Module

The Types module provides shared type definitions and utility functions used across all canisters in the Tepay platform. It ensures consistency and interoperability between different components of the system.

## Overview

- **File**: `types.mo`
- **Purpose**: Shared type definitions and utility functions
- **Used by**: All other canisters in the system
- **Dependencies**: Motoko base libraries (Principal, Time, Result)

## Features

- **Centralized Type Definitions**: Common types used across canisters
- **Error Handling**: Standardized error types for different operations
- **Validation Functions**: Input validation and format checking
- **Utility Functions**: Helper functions for common operations
- **Time Management**: Timestamp handling and utilities
- **Account Utilities**: Default account creation and management

## Core Type Definitions

### Principal and Account Types

#### Principal
```motoko
public type Principal = Principal.Principal;
```

Standard Internet Computer Principal type for identity management.

#### AccountIdentifier
```motoko
public type AccountIdentifier = Blob;
```

Binary account identifier format.

#### Subaccount
```motoko
public type Subaccount = Blob;
```

32-byte subaccount identifier for account subdivision.

#### Account
```motoko
public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
};
```

Complete account specification with optional subaccount.

### Time and Result Types

#### Timestamp
```motoko
public type Timestamp = Int;
```

Unix timestamp representation for time-based operations.

#### Result
```motoko
public type Result<T, E> = Result.Result<T, E>;
```

Standard Result type for error handling.

## Alias Registry Types

### AliasEntry
```motoko
public type AliasEntry = {
    alias : Text;
    owner : Principal;
    icon : ?Text;
    description : ?Text;
    created_at : Timestamp;
    updated_at : Timestamp;
};
```

Complete alias record containing:
- `alias`: The human-readable alias text
- `owner`: Principal ID of the alias owner
- `icon`: Optional emoji or icon representation
- `description`: Optional descriptive text
- `created_at`: Registration timestamp
- `updated_at`: Last modification timestamp

### AliasRegistrationResult
```motoko
public type AliasRegistrationResult = Result<(), AliasError>;
```

Result type for alias registration operations.

### AliasError
```motoko
public type AliasError = {
    #AlreadyTaken;
    #InvalidFormat;
    #TooShort;
    #TooLong;
    #InvalidCharacters;
    #Reserved;
    #NotFound;
    #NotOwner;
};
```

Comprehensive error types for alias operations:
- `#AlreadyTaken`: Alias is already registered by another user
- `#InvalidFormat`: Alias doesn't meet format requirements
- `#TooShort`: Alias is shorter than minimum length (3 characters)
- `#TooLong`: Alias exceeds maximum length (32 characters)
- `#InvalidCharacters`: Alias contains prohibited characters
- `#Reserved`: Alias is a reserved system word
- `#NotFound`: Alias doesn't exist in the registry
- `#NotOwner`: Caller is not the owner of the alias

## Analytics Types

### EventType
```motoko
public type EventType = {
    #Deposit;
    #Withdraw;
    #InterestPayment;
    #AliasRegistration;
    #Transfer;
};
```

Platform event categories:
- `#Deposit`: User deposits tokens into the platform
- `#Withdraw`: User withdraws tokens from the platform
- `#InterestPayment`: Automatic interest payment to users
- `#AliasRegistration`: New alias registration event
- `#Transfer`: Peer-to-peer token transfer

### AnalyticsEvent
```motoko
public type AnalyticsEvent = {
    id : Nat;
    event_type : EventType;
    principal : Principal;
    amount : ?Nat;
    alias : ?Text;
    timestamp : Timestamp;
    metadata : ?[(Text, Text)];
};
```

Complete event record for analytics:
- `id`: Unique event identifier
- `event_type`: Category of the event
- `principal`: Principal ID associated with the event
- `amount`: Optional monetary amount (for financial events)
- `alias`: Optional alias involved in the event
- `timestamp`: When the event occurred
- `metadata`: Optional key-value pairs for additional context

## Configuration Types

### VaultConfig
```motoko
public type VaultConfig = {
    annual_interest_rate : Float;
    min_deposit : Nat;
    max_deposit : Nat;
    withdrawal_fee : Nat;
    is_paused : Bool;
    admin_principals : [Principal];
};
```

Platform configuration parameters:
- `annual_interest_rate`: Interest rate (e.g., 0.05 for 5%)
- `min_deposit`: Minimum allowed deposit amount
- `max_deposit`: Maximum allowed deposit amount
- `withdrawal_fee`: Fee charged for withdrawals
- `is_paused`: Emergency pause flag for the platform
- `admin_principals`: Array of authorized administrators

### ConfigUpdateResult
```motoko
public type ConfigUpdateResult = Result<(), Text>;
```

Result type for configuration update operations.

## Utility Functions

### Alias Validation

#### validate_alias
```motoko
public func validate_alias(alias : Text) : Result<(), AliasError>
```

Validates alias format and content according to platform rules.

**Parameters:**
- `alias`: The alias text to validate

**Returns:** Success or specific validation error

**Validation Rules:**
- **Length**: Must be 3-32 characters
- **Characters**: Alphanumeric, underscore, and hyphen only
- **Reserved Words**: Cannot be system reserved words

**Reserved Words:**
- admin
- vault
- system
- root
- api
- www

**Example:**
```motoko
switch (Types.validate_alias("user123")) {
    case (#ok(())) {
        // Alias is valid
    };
    case (#err(#TooShort)) {
        // Handle too short error
    };
    case (#err(#Reserved)) {
        // Handle reserved word error
    };
    case (#err(error)) {
        // Handle other errors
    };
};
```

### Time Utilities

#### current_time
```motoko
public func current_time() : Timestamp
```

Returns the current system timestamp.

**Returns:** Current Unix timestamp

**Example:**
```motoko
let now = Types.current_time();
let event = {
    // ... other fields
    timestamp = now;
};
```

### Account Utilities

#### default_account
```motoko
public func default_account(owner : Principal) : Account
```

Creates a default account record for a Principal (no subaccount).

**Parameters:**
- `owner`: Principal ID for the account

**Returns:** Account record with null subaccount

**Example:**
```motoko
let user_account = Types.default_account(user_principal);
// Equivalent to: { owner = user_principal; subaccount = null }
```

## Usage Examples

### Error Handling Pattern
```motoko
import Types "./types";

public func register_alias(alias : Text) : async Types.AliasRegistrationResult {
    // Validate the alias
    switch (Types.validate_alias(alias)) {
        case (#err(error)) { return #err(error) };
        case (#ok(())) { /* Continue with registration */ };
    };
    
    // ... registration logic
    #ok(())
};
```

### Event Logging Pattern
```motoko
let event : Types.AnalyticsEvent = {
    id = next_id;
    event_type = #Transfer;
    principal = sender;
    amount = ?transfer_amount;
    alias = ?sender_alias;
    timestamp = Types.current_time();
    metadata = ?[
        ("recipient", recipient_alias),
        ("memo", transfer_memo)
    ];
};
```

### Configuration Management
```motoko
let config : Types.VaultConfig = {
    annual_interest_rate = 0.05; // 5%
    min_deposit = 1000000; // 1 token
    max_deposit = 1000000000000; // 1M tokens
    withdrawal_fee = 10000; // 0.01 token
    is_paused = false;
    admin_principals = [admin1, admin2];
};
```

## Integration Patterns

### Cross-Canister Communication
```motoko
// In Analytics Logger
public func log_event(
    event_type : Types.EventType,
    principal : Principal,
    amount : ?Nat,
    alias : ?Text,
    metadata : ?[(Text, Text)]
) : async Nat {
    let event : Types.AnalyticsEvent = {
        id = next_event_id;
        event_type = event_type;
        principal = principal;
        amount = amount;
        alias = alias;
        timestamp = Types.current_time();
        metadata = metadata;
    };
    // ... store event
};

// In Alias Registry  
import Analytics "canister:analytics";

public func register_alias(...) : async Types.AliasRegistrationResult {
    // ... registration logic
    
    // Log the event
    let _ = await Analytics.log_event(
        #AliasRegistration,
        caller,
        null,
        ?alias,
        ?[("action", "register")]
    );
    
    #ok(())
};
```

### Type Safety
The shared types ensure type safety across canisters:

```motoko
// All canisters use the same Account type
let user_account : Types.Account = {
    owner = user_principal;
    subaccount = null;
};

// Consistent error handling
let result : Types.AliasRegistrationResult = await alias_registry.register_alias("alice");
switch (result) {
    case (#ok(())) { /* Success */ };
    case (#err(error)) { /* Handle specific error */ };
};
```

## Validation Details

### Alias Validation Logic
The `validate_alias` function performs comprehensive validation:

1. **Trimming**: Removes leading/trailing whitespace (in concept - Motoko Text doesn't have built-in trim)
2. **Length Check**: Ensures 3-32 character range
3. **Character Validation**: Allows alphanumeric, underscore, hyphen
4. **Reserved Word Check**: Prevents registration of system words

### Character Set
Valid characters for aliases:
- Lowercase letters: a-z
- Uppercase letters: A-Z
- Numbers: 0-9
- Underscore: _
- Hyphen: -

### Reserved Words List
Currently reserved aliases:
- admin
- vault
- system
- root
- api
- www

Additional reserved words can be added by extending the `reserved_words` array.

## Extension Points

### Adding New Event Types
```motoko
public type EventType = {
    #Deposit;
    #Withdraw;
    #InterestPayment;
    #AliasRegistration;
    #Transfer;
    #Swap;           // New event type
    #Stake;          // New event type
    #Unstake;        // New event type
};
```

### Adding New Error Types
```motoko
public type AliasError = {
    // ... existing errors
    #RateLimited;    // New error type
    #Suspended;      // New error type
};
```

### Configuration Extensions
```motoko
public type VaultConfig = {
    // ... existing fields
    max_aliases_per_user : Nat;
    alias_registration_fee : Nat;
    referral_bonus_rate : Float;
};
```

## Best Practices

### Type Definition
- Keep types in a central module for consistency
- Use descriptive names for variants
- Include comprehensive error types
- Document type usage and constraints

### Validation
- Validate inputs at the boundary (public functions)
- Use Result types for operations that can fail
- Provide specific error messages
- Implement defensive programming practices

### Timestamps
- Use consistent timestamp format across canisters
- Store creation and update times for audit trails
- Consider timezone implications for user-facing features

### Metadata
- Use optional key-value pairs for extensible metadata
- Keep metadata keys consistent across similar events
- Don't store sensitive information in metadata

## Version Compatibility

The Types module is designed for backward compatibility:
- New optional fields can be added to records
- New error variants can be added to error types
- New event types can be added to EventType
- Existing function signatures should remain stable

This ensures smooth upgrades across the entire canister ecosystem.
