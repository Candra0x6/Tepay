# Analytics Logger Canister

The Analytics Logger canister provides comprehensive event tracking and analytics capabilities for the Tepay platform. It records user interactions, financial transactions, and system events to provide insights into platform usage and performance.

## Overview

- **File**: `analytics_logger.mo`
- **Purpose**: Track and analyze platform events and user behavior
- **Dependencies**: `types.mo`

## Features

- Event logging with structured data
- User activity tracking
- Financial transaction analytics
- Admin controls and data management
- Flexible querying and filtering
- Performance metrics and summaries
- Data export capabilities

## Data Structures

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

## State Management

The canister maintains:

1. **events**: HashMap storing all analytics events by ID
2. **next_event_id**: Counter for generating unique event IDs
3. **admin_principals**: Array of authorized admin principals

All data is persisted across upgrades using stable variables.

## Public API

### Event Logging

#### Log Event
```motoko
public shared(_msg) func log_event(
    event_type : EventType,
    principal : Principal,
    amount : ?Nat,
    alias : ?Text,
    metadata : ?[(Text, Text)]
) : async Nat
```

Records a new event in the analytics system.

**Parameters:**
- `event_type`: Type of event being logged
- `principal`: Principal ID associated with the event
- `amount`: Optional monetary amount (for financial events)
- `alias`: Optional user alias involved in the event
- `metadata`: Optional key-value pairs for additional context

**Returns:** Unique event ID for the logged event

**Example:**
```motoko
let event_id = await analytics.log_event(
    #Deposit,
    user_principal,
    ?1000000,  // 1 token (assuming 6 decimals)
    ?"alice",
    ?[("source", "wallet_connect"), ("device", "mobile")]
);
```

### Event Querying

#### Get Events by Principal
```motoko
public query func get_events_by_principal(
    principal : Principal,
    limit : ?Nat
) : async [AnalyticsEvent]
```

Retrieves events associated with a specific Principal ID.

**Parameters:**
- `principal`: Principal ID to filter by
- `limit`: Maximum number of results (default: 10, max: 100)

**Returns:** Array of analytics events

#### Get Events by Type
```motoko
public query func get_events_by_type(
    event_type : EventType,
    limit : ?Nat
) : async [AnalyticsEvent]
```

Retrieves events of a specific type.

**Parameters:**
- `event_type`: Type of events to retrieve
- `limit`: Maximum number of results (default: 10, max: 100)

**Returns:** Array of analytics events

#### Get Recent Events
```motoko
public query func get_recent_events(limit : ?Nat) : async [AnalyticsEvent]
```

Retrieves most recent events across all types.

**Parameters:**
- `limit`: Maximum number of results (default: 20, max: 100)

**Returns:** Array of recent analytics events

#### Get Events by Alias
```motoko
public query func get_events_by_alias(
    alias : Text,
    limit : ?Nat
) : async [AnalyticsEvent]
```

Retrieves events associated with a specific alias.

**Parameters:**
- `alias`: Alias to filter by
- `limit`: Maximum number of results (default: 10, max: 100)

**Returns:** Array of analytics events

#### Get Event by ID
```motoko
public query func get_event(id : Nat) : async ?AnalyticsEvent
```

Retrieves a specific event by its ID.

**Parameters:**
- `id`: Event ID to retrieve

**Returns:** Analytics event or `null` if not found

### Analytics and Metrics

#### Get Analytics Summary
```motoko
public query func get_analytics_summary() : async {
    total_events : Nat;
    deposits_count : Nat;
    withdrawals_count : Nat;
    total_deposit_volume : Nat;
    total_withdrawal_volume : Nat;
    unique_users : Nat;
}
```

Provides a comprehensive summary of platform analytics.

**Returns:** Analytics summary object containing:
- `total_events`: Total number of logged events
- `deposits_count`: Number of deposit events
- `withdrawals_count`: Number of withdrawal events
- `total_deposit_volume`: Total amount deposited
- `total_withdrawal_volume`: Total amount withdrawn
- `unique_users`: Number of unique users who have generated events

#### Get Event Count
```motoko
public query func get_event_count() : async Nat
```

Returns the total number of events in the system.

**Returns:** Total event count

## Admin Functions

### Add Admin
```motoko
public shared(msg) func add_admin(new_admin : Principal) : async Bool
```

Adds a new admin principal to the system.

**Parameters:**
- `new_admin`: Principal ID to grant admin privileges

**Returns:** `true` if successful, `false` if unauthorized

**Authorization:** 
- First admin can be added by anyone (bootstrap)
- Subsequent admins must be added by existing admins

### Clear Old Events
```motoko
public shared(msg) func clear_events_before(timestamp : Int) : async Bool
```

Removes events older than the specified timestamp (admin only).

**Parameters:**
- `timestamp`: Unix timestamp; events before this time will be deleted

**Returns:** `true` if successful, `false` if unauthorized

**Authorization:** Admin only

### Export All Events
```motoko
public shared(msg) func export_all_events() : async ?[AnalyticsEvent]
```

Exports all events for backup purposes (admin only).

**Returns:** All events array if authorized, `null` if unauthorized

**Authorization:** Admin only

## Event Types

### Deposit
Records when users deposit tokens into the platform.

**Typical metadata:**
- `source`: Origin of the deposit (e.g., "wallet_connect", "bank_transfer")
- `transaction_id`: External transaction identifier

### Withdraw
Records when users withdraw tokens from the platform.

**Typical metadata:**
- `destination`: Withdrawal destination
- `transaction_id`: External transaction identifier

### Transfer
Records peer-to-peer transfers between users.

**Typical metadata:**
- `from_alias`: Sender's alias
- `to_alias`: Recipient's alias
- `memo`: Transfer memo/note

### Interest Payment
Records automatic interest payments to users.

**Typical metadata:**
- `rate`: Interest rate applied
- `period`: Time period for interest calculation

### Alias Registration
Records when users register new aliases.

**Typical metadata:**
- `alias_type`: Type of alias registered
- `previous_alias`: If updating an existing alias

## Usage Examples

### Log a Deposit Event
```motoko
let deposit_id = await analytics.log_event(
    #Deposit,
    user_principal,
    ?5000000,  // 5 tokens
    ?"alice",
    ?[
        ("source", "metamask"),
        ("network", "ethereum"),
        ("tx_hash", "0x1234...")
    ]
);
```

### Get User Activity
```motoko
let user_events = await analytics.get_events_by_principal(
    user_principal,
    ?50  // Last 50 events
);
```

### Generate Platform Summary
```motoko
let summary = await analytics.get_analytics_summary();
let total_volume = summary.total_deposit_volume + summary.total_withdrawal_volume;
```

## Performance Considerations

### Query Limits
- All query functions have built-in limits to prevent performance issues
- Maximum 100 results per query
- Default limits are conservative (10-20 results)

### Data Retention
- Admin functions allow clearing old events
- Consider implementing automatic archival for very old data
- Events are stored in memory for fast access

### Indexing
- Events are stored by ID for O(1) access
- Filtering operations are O(n) and may be slow with large datasets
- Consider implementing secondary indexes for frequently queried fields

## Privacy and Security

### Data Access
- Public queries allow access to event data
- Consider implementing privacy controls for sensitive events
- Admin functions are properly protected

### Data Anonymization
- Principal IDs are stored but could be hashed for privacy
- Metadata should not contain sensitive personal information
- Consider GDPR compliance requirements

## Integration Patterns

### Event Sourcing
```motoko
// Log event and get ID for correlation
let event_id = await analytics.log_event(#Transfer, sender, ?amount, ?alias, metadata);

// Use event ID for error handling or confirmation
if (transfer_successful) {
    // Continue processing
} else {
    // Could mark event as failed in metadata
}
```

### Batch Analysis
```motoko
// Get all deposits for analysis
let deposits = await analytics.get_events_by_type(#Deposit, ?100);

// Calculate metrics
var total_volume = 0;
for (event in deposits.vals()) {
    switch (event.amount) {
        case (?amount) { total_volume += amount };
        case null { /* Skip */ };
    };
};
```

## Monitoring and Alerting

The analytics data can be used for:

- **Volume monitoring**: Track unusual deposit/withdrawal patterns
- **User engagement**: Monitor active user counts and behavior
- **Performance metrics**: Track transaction success rates
- **Security alerts**: Detect suspicious activity patterns

## Upgrade Safety

The canister implements proper upgrade hooks:
- `preupgrade()`: Saves events and admin state to stable variables
- `postupgrade()`: Restores state from stable variables

This ensures complete data persistence across canister upgrades.
