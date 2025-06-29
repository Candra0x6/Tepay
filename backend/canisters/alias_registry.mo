import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Char "mo:base/Char";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Types "./types";

actor AliasRegistry {

    // ============ STATE ============
    private stable var aliases_entries : [(Text, Types.AliasEntry)] = [];
    private stable var reverse_entries : [(Principal, [Text])] = [];

    private var aliases = HashMap.HashMap<Text, Types.AliasEntry>(0, Text.equal, Text.hash);
    private var reverse_map = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);

    // ============ SYSTEM FUNCTIONS ============

    system func preupgrade() {
        aliases_entries := Iter.toArray(aliases.entries());
        reverse_entries := Iter.toArray(reverse_map.entries());
    };

    system func postupgrade() {
        aliases := HashMap.fromIter<Text, Types.AliasEntry>(
            aliases_entries.vals(),
            aliases_entries.size(),
            Text.equal,
            Text.hash,
        );
        reverse_map := HashMap.fromIter<Principal, [Text]>(
            reverse_entries.vals(),
            reverse_entries.size(),
            Principal.equal,
            Principal.hash,
        );
        aliases_entries := [];
        reverse_entries := [];
    };

    // ============ PRIVATE FUNCTIONS ============

    private func normalize_alias(alias : Text) : Text {
        // Convert to lowercase (simplified implementation)
        Text.map(
            alias,
            func(c : Char) : Char {
                if (c >= 'A' and c <= 'Z') {
                    Char.fromNat32(Char.toNat32(c) + 32);
                } else {
                    c;
                };
            },
        );
    };

    private func add_to_reverse_map(principal : Principal, alias : Text) {
        switch (reverse_map.get(principal)) {
            case (?existing_aliases) {
                let new_aliases = Array.append<Text>(existing_aliases, [alias]);
                reverse_map.put(principal, new_aliases);
            };
            case null {
                reverse_map.put(principal, [alias]);
            };
        };
    };

    private func remove_from_reverse_map(principal : Principal, alias : Text) {
        switch (reverse_map.get(principal)) {
            case (?existing_aliases) {
                let filtered = Array.filter<Text>(existing_aliases, func(a) { a != alias });
                if (filtered.size() == 0) {
                    reverse_map.delete(principal);
                } else {
                    reverse_map.put(principal, filtered);
                };
            };
            case null { /* Do nothing */ };
        };
    };

    // ============ PUBLIC API ============

    /// Register a new alias for the caller with optional icon and description
    public shared (msg) func register_alias(alias : Text, icon : ?Text, description : ?Text) : async Types.AliasRegistrationResult {
        let caller = msg.caller;
        let normalized_alias = normalize_alias(alias);

        // Validate alias format
        switch (Types.validate_alias(normalized_alias)) {
            case (#err(error)) { return #err(error) };
            case (#ok(())) { /* Continue */ };
        };

        // Check if alias is already taken
        switch (aliases.get(normalized_alias)) {
            case (?existing) {
                if (existing.owner != caller) {
                    return #err(#AlreadyTaken);
                } else {
                    // User is re-registering their own alias, update timestamp and metadata
                    let updated_entry : Types.AliasEntry = {
                        alias = normalized_alias;
                        owner = caller;
                        icon = icon;
                        description = description;
                        created_at = existing.created_at;
                        updated_at = Types.current_time();
                    };
                    aliases.put(normalized_alias, updated_entry);
                    return #ok(());
                };
            };
            case null { /* Continue with registration */ };
        };

        // Create new alias entry
        let entry : Types.AliasEntry = {
            alias = normalized_alias;
            owner = caller;
            icon = icon;
            description = description;
            created_at = Types.current_time();
            updated_at = Types.current_time();
        };

        // Store alias
        aliases.put(normalized_alias, entry);
        add_to_reverse_map(caller, normalized_alias);

        #ok(());
    };

    /// Update alias metadata (icon and description) - only owner can update
    public shared (msg) func update_alias_metadata(alias : Text, new_alias : Text, icon : ?Text, description : ?Text) : async Types.AliasRegistrationResult {
        let caller = msg.caller;
        let normalized_alias = normalize_alias(alias);

        switch (aliases.get(normalized_alias)) {
            case (?existing) {
                if (existing.owner != caller) {
                    return #err(#NotOwner);
                };

                let updated_entry : Types.AliasEntry = {
                    alias = new_alias;
                    owner = existing.owner;
                    icon = icon;
                    description = description;
                    created_at = existing.created_at;
                    updated_at = Types.current_time();
                };

                aliases.put(normalized_alias, updated_entry);
                #ok(());
            };
            case null {
                #err(#NotFound);
            };
        };
    };

    /// Resolve an alias to a Principal
    public query func resolve_alias(alias : Text) : async ?Principal {
        let normalized_alias = normalize_alias(alias);
        switch (aliases.get(normalized_alias)) {
            case (?entry) { ?entry.owner };
            case null { null };
        };
    };

    /// Get all aliases owned by a Principal
    public query func get_aliases_of(principal : Principal) : async [Text] {
        switch (reverse_map.get(principal)) {
            case (?alias_list) { alias_list };
            case null { [] };
        };
    };

    /// Remove an alias (only owner can remove)
    public shared (msg) func remove_alias(alias : Text) : async Types.AliasRegistrationResult {
        let caller = msg.caller;
        let normalized_alias = normalize_alias(alias);

        switch (aliases.get(normalized_alias)) {
            case (?entry) {
                if (entry.owner != caller) {
                    return #err(#NotOwner);
                };

                aliases.delete(normalized_alias);
                remove_from_reverse_map(caller, normalized_alias);
                #ok(());
            };
            case null {
                #err(#NotFound);
            };
        };
    };

    /// Get alias information
    public query func get_alias_info(alias : Text) : async ?Types.AliasEntry {
        let normalized_alias = normalize_alias(alias);
        aliases.get(normalized_alias);
    };

    /// Check if alias is available
    public query func is_alias_available(alias : Text) : async Bool {
        let normalized_alias = normalize_alias(alias);
        switch (Types.validate_alias(normalized_alias)) {
            case (#err(_)) { false };
            case (#ok(())) {
                switch (aliases.get(normalized_alias)) {
                    case (?_) { false };
                    case null { true };
                };
            };
        };
    };

    /// Get total number of registered aliases
    public query func get_alias_count() : async Nat {
        aliases.size();
    };

    /// Get all aliases (admin function - could be restricted)
    public query func get_all_aliases() : async [(Text, Types.AliasEntry)] {
        Iter.toArray(aliases.entries());
    };
};
