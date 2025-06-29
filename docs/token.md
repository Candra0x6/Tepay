# Token Canister

The Token canister implements a comprehensive ICRC-1 and ICRC-2 compliant token system for the Tepay platform. It provides full functionality for token transfers, balance management, allowances, and transaction history.

## Overview

- **File**: `token.mo`
- **Purpose**: ICRC-1/ICRC-2 compliant token implementation
- **Standards**: ICRC-1 (Fungible Token), ICRC-2 (Approval Extension)
- **Features**: Transfers, balances, allowances, transaction history, minting, burning

## Features

- **ICRC-1 Standard Compliance**: Full implementation of the ICRC-1 fungible token standard
- **ICRC-2 Standard Compliance**: Approval and transfer-from functionality
- **Token Management**: Initialize tokens with custom parameters
- **Transaction History**: Complete audit trail of all transactions
- **Balance Tracking**: Real-time balance calculations
- **Fee Management**: Configurable transfer fees
- **Allowance System**: Approve third parties to spend tokens
- **Minting and Burning**: Administrative token supply management

## Data Structures

### Core Types

#### Account
```motoko
public type Account = { 
    owner : Principal; 
    subaccount : ?Subaccount 
};
```

#### Transaction
```motoko
public type Transaction = {
    operation : Operation;
    fee : Tokens;
    timestamp : Timestamp;
};
```

#### Operation
```motoko
public type Operation = {
    #Approve : Approve;
    #Transfer : Transfer;
    #Burn : Transfer;
    #Mint : Transfer;
};
```

#### Transfer
```motoko
public type Transfer = CommonFields and {
    spender : Account;
    source : TransferSource;
    to : Account;
    from : Account;
    amount : Tokens;
};
```

#### Allowance
```motoko
type Allowance = {
    amount : Tokens;
    expires_at : ?Nat64;
};
```

### Error Types

#### TransferError
```motoko
public type TransferError = {
    #TooOld;
    #Duplicate : { duplicate_of : TxIndex };
    #CreatedInFuture : { ledger_time : Timestamp };
    #InsufficientFunds : { balance : Tokens };
    #BadFee : { expected_fee : Tokens };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
    #BadBurn : { min_burn_amount : Tokens };
};
```

#### ApproveError
```motoko
type ApproveError = {
    #BadFee : { expected_fee : Nat };
    #InsufficientFunds : { balance : Nat };
    #ApproveError : Text;
    #Expired : { ledger_time : Nat64 };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
};
```

## Token Configuration

### Token Parameters
```motoko
stable var tokenConfig : {
    initial_mints : [{
        account : { owner : Principal; subaccount : ?Blob };
        amount : Nat;
    }];
    minting_account : { owner : Principal; subaccount : ?Blob };
    token_name : Text;
    token_symbol : Text;
    decimals : Nat8;
    transfer_fee : Nat;
}
```

## ICRC-1 Standard Functions

### Token Information

#### Get Token Name
```motoko
public query func icrc1_name() : async Text
```

Returns the token's name.

#### Get Token Symbol
```motoko
public query func icrc1_symbol() : async Text
```

Returns the token's symbol.

#### Get Decimals
```motoko
public query func icrc1_decimals() : async Nat8
```

Returns the number of decimal places for the token.

#### Get Transfer Fee
```motoko
public query func icrc1_fee() : async Tokens
```

Returns the fee charged for transfers.

#### Get Total Supply
```motoko
public query func icrc1_total_supply() : async Tokens
```

Returns the total token supply.

#### Get Minting Account
```motoko
public query func icrc1_minting_account() : async Account
```

Returns the account authorized to mint new tokens.

#### Get Supported Standards
```motoko
public query func icrc1_supported_standards() : async [{
    name : Text;
    url : Text;
}]
```

Returns the list of supported token standards.

### Balance and Transfer Operations

#### Get Balance
```motoko
public query func icrc1_balance_of(account : Account) : async Tokens
```

Returns the token balance of the specified account.

**Parameters:**
- `account`: Account to query

**Returns:** Token balance

**Example:**
```motoko
let balance = await token.icrc1_balance_of({
    owner = user_principal;
    subaccount = null;
});
```

#### Transfer Tokens
```motoko
public shared ({ caller }) func icrc1_transfer({
    from_subaccount : ?Subaccount;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
}) : async Result<TxIndex, TransferError>
```

Transfers tokens from the caller's account to another account.

**Parameters:**
- `from_subaccount`: Optional subaccount for the sender
- `to`: Recipient account
- `amount`: Amount of tokens to transfer
- `fee`: Optional fee (must match expected fee)
- `memo`: Optional memo/note for the transfer
- `created_at_time`: Optional timestamp for deduplication

**Returns:** Transaction index on success, error on failure

**Example:**
```motoko
let result = await token.icrc1_transfer({
    from_subaccount = null;
    to = { owner = recipient_principal; subaccount = null };
    amount = 1000000; // 1 token (assuming 6 decimals)
    fee = null;
    memo = ?Text.encodeUtf8("Payment for services");
    created_at_time = null;
});
```

## ICRC-2 Approval Extension

### Approve
```motoko
public shared ({ caller }) func icrc2_approve(request : ApproveRequest) : async ApproveResult
```

Approves a spender to transfer tokens on behalf of the caller.

**Parameters:**
```motoko
type ApproveRequest = {
    from_subaccount : ?[Nat8];
    spender : Principal;
    amount : Tokens;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?[Nat8];
    created_at_time : ?Nat64;
};
```

**Returns:** Amount approved on success, error on failure

**Example:**
```motoko
let result = await token.icrc2_approve({
    from_subaccount = null;
    spender = dex_principal;
    amount = 5000000; // 5 tokens
    expires_at = ?(Time.now() + 3600_000_000_000); // 1 hour
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Transfer From
```motoko
public shared ({ caller }) func icrc2_transfer_from(request : TransferFromRequest) : async TransferFromResult
```

Allows an approved spender to transfer tokens on behalf of another account.

**Parameters:**
```motoko
type TransferFromRequest = {
    spender_subaccount : ?[Nat8];
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?[Nat8];
    created_at_time : ?Nat64;
};
```

**Returns:** Transaction index on success, error on failure

**Example:**
```motoko
let result = await token.icrc2_transfer_from({
    spender_subaccount = null;
    from = { owner = user_principal; subaccount = null };
    to = { owner = recipient_principal; subaccount = null };
    amount = 1000000;
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Check Allowance
```motoko
public query func icrc2_allowance(request : AllowanceRequest) : async Allowance
```

Returns the current allowance for a spender.

**Parameters:**
```motoko
type AllowanceRequest = {
    account : Account;
    spender : Principal;
};
```

**Returns:** Current allowance amount and expiration

## Custom Functions

### Initialize Token
```motoko
public func initializeToken({
    tokenName : Text;
    tokenSymbol : Text;
    initialSupply : Nat;
    tokenLogo : Text;
    principal : Principal;
}) : async Result<Text, Text>
```

Initializes the token with specified parameters. Can only be called once.

**Parameters:**
- `tokenName`: Human-readable token name
- `tokenSymbol`: Token symbol (e.g., "TEPAY")
- `initialSupply`: Initial token supply
- `tokenLogo`: Token logo/image
- `principal`: Principal that will receive initial supply

**Returns:** Success message or error

**Example:**
```motoko
let result = await token.initializeToken({
    tokenName = "Tepay Token";
    tokenSymbol = "TEPAY";
    initialSupply = 1000000000; // 1 billion tokens
    tokenLogo = "data:image/svg+xml;base64,...";
    principal = owner_principal;
});
```

### Get All Transactions
```motoko
public func getAllTransactions() : async [Transaction]
```

Returns complete transaction history.

**Returns:** Array of all transactions

### Get Transaction History
```motoko
public func transactionHistoryOf(account : Account) : async [Transaction]
```

Returns transaction history for a specific account.

**Parameters:**
- `account`: Account to query

**Returns:** Array of transactions involving the account

**Example:**
```motoko
let history = await token.transactionHistoryOf({
    owner = user_principal;
    subaccount = null;
});
```

### Get Genesis Transaction
```motoko
public query func getGenesisTransaction() : async ?Transaction
```

Returns the first transaction (token initialization).

**Returns:** Genesis transaction or null

## Transaction Types

### Mint
Creates new tokens and assigns them to an account.
- Only minting account can mint
- No fee charged for minting

### Burn
Destroys tokens from an account.
- Reduces total supply
- Must meet minimum burn amount

### Transfer
Moves tokens between accounts.
- Charges transfer fee
- Validates sufficient balance

### Approve
Grants permission for third-party transfers.
- Creates allowance record
- Can set expiration time

## Security Features

### Time-based Validation
- **Transaction Windows**: Transactions must be within valid time range
- **Drift Tolerance**: Allows for network latency
- **Deduplication**: Prevents replay attacks using timestamps

### Balance Validation
- **Sufficient Funds**: Ensures adequate balance before transfers
- **Fee Calculation**: Validates correct fee amounts
- **Allowance Checks**: Verifies spending permissions

### Access Control
- **Caller Authentication**: Uses Internet Computer's built-in caller identification
- **Minting Restrictions**: Only authorized accounts can mint
- **Ownership Verification**: Account owners control their tokens

## Performance Considerations

### Memory Management
- Transactions stored in memory for fast access
- Stable variables ensure persistence across upgrades
- Buffer-based transaction log for efficient operations

### Query Optimization
- Balance calculations are O(n) with transaction count
- Consider implementing balance caching for large transaction volumes
- Transaction lookups are optimized with Buffer data structure

### Scalability
- Current implementation suitable for moderate transaction volumes
- Consider implementing transaction archival for high-volume applications
- Memory usage grows with transaction history

## Usage Patterns

### Basic Transfer
```motoko
// Simple token transfer
let result = await token.icrc1_transfer({
    from_subaccount = null;
    to = { owner = recipient; subaccount = null };
    amount = 1000000;
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Approval-based Transfer
```motoko
// 1. Approve spender
let approve_result = await token.icrc2_approve({
    from_subaccount = null;
    spender = dex_canister;
    amount = 5000000;
    expires_at = ?(Time.now() + 3600_000_000_000);
    fee = null;
    memo = null;
    created_at_time = null;
});

// 2. Spender executes transfer
let transfer_result = await token.icrc2_transfer_from({
    spender_subaccount = null;
    from = { owner = user_principal; subaccount = null };
    to = { owner = recipient; subaccount = null };
    amount = 1000000;
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Balance Monitoring
```motoko
// Check balance before transfer
let balance = await token.icrc1_balance_of({
    owner = user_principal;
    subaccount = null;
});

if (balance >= transfer_amount + fee) {
    // Proceed with transfer
}
```

## Error Handling

The token canister provides comprehensive error handling:

### Common Transfer Errors
- **InsufficientFunds**: Not enough balance for transfer + fee
- **BadFee**: Incorrect fee amount
- **TooOld**: Transaction timestamp too old
- **CreatedInFuture**: Transaction timestamp in the future
- **Duplicate**: Transaction already processed

### Approval Errors
- **InsufficientAllowance**: Spender doesn't have enough allowance
- **Expired**: Allowance has expired
- **InsufficientFunds**: Approver doesn't have enough balance

## Integration Examples

### DeFi Integration
```motoko
// Approve DEX for token swaps
await token.icrc2_approve({
    spender = dex_canister_id;
    amount = swap_amount;
    expires_at = ?(Time.now() + 600_000_000_000); // 10 minutes
    // ... other parameters
});
```

### Payment Processing
```motoko
// Process payment with memo
await token.icrc1_transfer({
    to = { owner = merchant; subaccount = null };
    amount = payment_amount;
    memo = ?Text.encodeUtf8("Order #12345");
    // ... other parameters
});
```

### Batch Operations
```motoko
// Multiple transfers (implement in calling code)
for (recipient in recipients.vals()) {
    let result = await token.icrc1_transfer({
        to = { owner = recipient; subaccount = null };
        amount = distribution_amount;
        // ... other parameters
    });
};
```

## Upgrade Safety

The canister implements proper upgrade hooks:
- `preupgrade()`: Saves transaction log and allowances to stable variables
- `postupgrade()`: Restores state from stable variables

This ensures complete data persistence across canister upgrades, including:
- Transaction history
- Token configuration
- Allowance mappings
- Balance state (derived from transactions)
