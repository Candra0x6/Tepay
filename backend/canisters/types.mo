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
