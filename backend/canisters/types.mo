import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";

module {
    // ============ SHARED TYPES ============

    // Principal and Account types
    public type Principal = Principal.Principal;
    public type AccountIdentifier = Blob;
    public type Subaccount = Blob;

    // Time and Result types
    public type Timestamp = Int;
    public type Result<T, E> = Result.Result<T, E>;

    // ============ ICRC-1 TOKEN TYPES ============

    public type Account = {
        owner : Principal;
        subaccount : ?Subaccount;
    };

    public type TransferArgs = {
        from_subaccount : ?Subaccount;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type TransferResult = Result<Nat, TransferError>;

    public type TransferError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    // ============ ICRC-2 TOKEN TYPES ============

    public type TransferFromArgs = {
        spender_subaccount : ?Subaccount;
        from : Account;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type TransferFromError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #InsufficientAllowance : { allowance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    public type ApproveArgs = {
        from_subaccount : ?Subaccount;
        spender : Account;
        amount : Nat;
        expected_allowance : ?Nat;
        expires_at : ?Nat64;
        fee : ?Nat;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type ApproveResult = Result<Nat, ApproveError>;

    public type ApproveError = {
        #BadFee : { expected_fee : Nat };
        #InsufficientFunds : { balance : Nat };
        #AllowanceChanged : { current_allowance : Nat };
        #Expired : { ledger_time : Nat64 };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    // ============ VAULT TYPES ============

    public type VaultAccount = {
        principal : Principal;
        balance : Nat;
        total_deposited : Nat;
        total_withdrawn : Nat;
        total_interest_earned : Nat;
        last_activity : Timestamp;
        created_at : Timestamp;
    };

    public type DepositResult = Result<{ transaction_id : Nat; new_balance : Nat }, Text>;
    public type WithdrawResult = Result<{ transaction_id : Nat; amount_withdrawn : Nat; new_balance : Nat }, Text>;
    public type InterestResult = Result<{ interest_earned : Nat; new_balance : Nat }, Text>;

    // ============ ALIAS REGISTRY TYPES ============

    public type AliasEntry = {
        alias : Text;
        owner : Principal;
        icon : ?Text;
        description : ?Text;
        created_at : Timestamp;
        updated_at : Timestamp;
    };

    public type AliasRegistrationResult = Result<(), AliasError>;

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

    // ============ ANALYTICS TYPES ============

    public type EventType = {
        #Deposit;
        #Withdraw;
        #InterestPayment;
        #AliasRegistration;
        #Transfer;
    };

    public type AnalyticsEvent = {
        id : Nat;
        event_type : EventType;
        principal : Principal;
        amount : ?Nat;
        alias : ?Text;
        timestamp : Timestamp;
        metadata : ?[(Text, Text)];
    };

    // ============ CONFIG TYPES ============

    public type VaultConfig = {
        annual_interest_rate : Float; // e.g., 0.05 for 5%
        min_deposit : Nat;
        max_deposit : Nat;
        withdrawal_fee : Nat;
        is_paused : Bool;
        admin_principals : [Principal];
    };

    public type ConfigUpdateResult = Result<(), Text>;

    // ============ UTILITY FUNCTIONS ============

    public func validate_alias(alias : Text) : Result<(), AliasError> {
        let trimmed = alias;

        // Check length
        if (trimmed.size() < 3) {
            return #err(#TooShort);
        };
        if (trimmed.size() > 32) {
            return #err(#TooLong);
        };

        // Check characters (simplified - in real implementation would check each char)
        // This is a placeholder for character validation
        let _valid_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

        // Check for reserved words
        let reserved_words = ["admin", "vault", "system", "root", "api", "www"];
        let lower_alias = alias; // In real implementation, would convert to lowercase

        for (word in reserved_words.vals()) {
            if (lower_alias == word) {
                return #err(#Reserved);
            };
        };

        #ok(());
    };

    public func current_time() : Timestamp {
        Time.now();
    };

    public func default_account(owner : Principal) : Account {
        { owner = owner; subaccount = null };
    };
};
