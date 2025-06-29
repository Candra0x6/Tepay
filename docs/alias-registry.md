# Alias Registry Canister

The Alias Registry canister provides a decentralized naming service that allows users to register human-readable aliases for their Principal IDs. This makes it easier for users to send payments and interact with the platform using memorable names instead of cryptographic identifiers.

## Overview

- **File**: `alias_registry.mo`
- **Purpose**: Manage user-friendly aliases for Principal IDs
- **Dependencies**: `types.mo`

## Features

- Register and manage custom aliases
- Resolve aliases to Principal IDs
- Update alias metadata (icon, description)
- Prevent duplicate registrations
- Case-insensitive alias handling
- Validation of alias format and reserved words

## Data Structures

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

### AliasRegistrationResult
```motoko
public type AliasRegistrationResult = Result<(), AliasError>;
```

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

## State Management

The canister maintains two main data structures:

1. **aliases**: Maps normalized aliases to `AliasEntry` records
2. **reverse_map**: Maps Principal IDs to arrays of their owned aliases

Both maps are persisted across upgrades using stable variables.

## Public API

### Register Alias
```motoko
public shared (msg) func register_alias(
    alias : Text, 
    icon : ?Text, 
    description : ?Text
) : async AliasRegistrationResult
```

Registers a new alias for the caller with optional metadata.

**Parameters:**
- `alias`: The desired alias (3-32 characters)
- `icon`: Optional icon/emoji for the alias
- `description`: Optional description text

**Returns:** Result indicating success or specific error

**Errors:**
- `#AlreadyTaken`: Alias is already registered by another user
- `#TooShort`: Alias is less than 3 characters
- `#TooLong`: Alias is more than 32 characters
- `#Reserved`: Alias is a reserved word
- `#InvalidCharacters`: Alias contains invalid characters

### Update Alias Metadata
```motoko
public shared (msg) func update_alias_metadata(
    alias : Text, 
    new_alias : Text, 
    icon : ?Text, 
    description : ?Text
) : async AliasRegistrationResult
```

Updates the metadata of an existing alias. Only the owner can update their alias.

**Parameters:**
- `alias`: Current alias to update
- `new_alias`: New alias text
- `icon`: New icon/emoji
- `description`: New description

**Returns:** Result indicating success or error

**Errors:**
- `#NotFound`: Alias doesn't exist
- `#NotOwner`: Caller is not the owner of the alias

### Resolve Alias
```motoko
public query func resolve_alias(alias : Text) : async ?Principal
```

Resolves an alias to its owner's Principal ID.

**Parameters:**
- `alias`: The alias to resolve

**Returns:** Principal ID of the alias owner, or `null` if not found

### Get Aliases of Principal
```motoko
public query func get_aliases_of(principal : Principal) : async [Text]
```

Returns all aliases owned by a specific Principal.

**Parameters:**
- `principal`: The Principal ID to query

**Returns:** Array of alias strings owned by the principal

### Remove Alias
```motoko
public shared (msg) func remove_alias(alias : Text) : async AliasRegistrationResult
```

Removes an alias. Only the owner can remove their alias.

**Parameters:**
- `alias`: The alias to remove

**Returns:** Result indicating success or error

**Errors:**
- `#NotFound`: Alias doesn't exist
- `#NotOwner`: Caller is not the owner of the alias

### Get Alias Information
```motoko
public query func get_alias_info(alias : Text) : async ?AliasEntry
```

Retrieves complete information about an alias.

**Parameters:**
- `alias`: The alias to query

**Returns:** Complete `AliasEntry` record or `null` if not found

### Check Alias Availability
```motoko
public query func is_alias_available(alias : Text) : async Bool
```

Checks if an alias is available for registration.

**Parameters:**
- `alias`: The alias to check

**Returns:** `true` if available, `false` if taken or invalid

### Get Statistics
```motoko
public query func get_alias_count() : async Nat
```

Returns the total number of registered aliases.

**Returns:** Total count of registered aliases

### Get All Aliases (Admin)
```motoko
public query func get_all_aliases() : async [(Text, AliasEntry)]
```

Returns all registered aliases with their complete information.

**Returns:** Array of tuples containing alias text and entry data

## Private Functions

### normalize_alias
Converts aliases to lowercase for case-insensitive handling.

### add_to_reverse_map / remove_from_reverse_map
Maintains the reverse mapping from Principal IDs to their owned aliases.

## Validation Rules

### Alias Format Requirements
- **Length**: 3-32 characters
- **Characters**: Alphanumeric, underscore, and hyphen allowed
- **Case**: Case-insensitive (normalized to lowercase)

### Reserved Words
The following aliases are reserved and cannot be registered:
- admin
- vault
- system
- root
- api
- www

## Usage Examples

### Register an Alias
```motoko
let result = await alias_registry.register_alias("alice", ?"👩‍💼", ?"Alice's business account");
```

### Resolve an Alias
```motoko
let principal = await alias_registry.resolve_alias("alice");
```

### Check Availability
```motoko
let available = await alias_registry.is_alias_available("newuser");
```

## Error Handling

The canister uses a comprehensive error system to provide clear feedback:

- **Validation errors**: Check format, length, and character restrictions
- **Ownership errors**: Ensure only owners can modify their aliases
- **Availability errors**: Prevent duplicate registrations

## Security Considerations

- **Caller Authentication**: All modifications require valid caller Principal
- **Ownership Verification**: Only alias owners can update or remove their aliases
- **Input Validation**: All inputs are validated before processing
- **Case Normalization**: Prevents case-based duplicate registrations

## Integration

The Alias Registry is designed to be used by other canisters and frontend applications:

- **Payment System**: Users can send payments to aliases instead of Principal IDs
- **Social Features**: Display user-friendly names in interfaces
- **Identity Management**: Provide human-readable identifiers

## Upgrade Safety

The canister implements proper upgrade hooks:
- `preupgrade()`: Saves state to stable variables
- `postupgrade()`: Restores state from stable variables

This ensures data persistence across canister upgrades.
