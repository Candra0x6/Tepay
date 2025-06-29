import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

import Types "./types";

actor AnalyticsLogger {
    
    // ============ STATE ============
    
    private stable var events_entries : [(Nat, Types.AnalyticsEvent)] = [];
    private stable var next_event_id : Nat = 1;
    private stable var admin_principals : [Principal] = [];
    
    private var events = HashMap.HashMap<Nat, Types.AnalyticsEvent>(0, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n % (2**32 - 1)) });
    
    // ============ SYSTEM FUNCTIONS ============
    
    system func preupgrade() {
        events_entries := Iter.toArray(events.entries());
    };
    
    system func postupgrade() {
        events := HashMap.fromIter<Nat, Types.AnalyticsEvent>(
            events_entries.vals(),
            events_entries.size(),
            Nat.equal,
            func(n : Nat) : Nat32 { Nat32.fromNat(n % (2**32 - 1)) }
        );
        events_entries := [];
    };
    
    // ============ PRIVATE FUNCTIONS ============
    
    private func is_admin(caller : Principal) : Bool {
        for (admin in admin_principals.vals()) {
            if (Principal.equal(caller, admin)) {
                return true;
            };
        };
        false
    };
    
    // ============ PUBLIC API ============
    
    /// Log a new event
    public shared(_msg) func log_event(
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
        
        events.put(next_event_id, event);
        let event_id = next_event_id;
        next_event_id += 1;
        
        event_id
    };
    
    /// Get events by principal
    public query func get_events_by_principal(
        principal : Principal,
        limit : ?Nat
    ) : async [Types.AnalyticsEvent] {
        let max_results = switch (limit) {
            case (?l) { if (l > 100) { 100 } else { l } };
            case null { 10 };
        };
        
        var results : [Types.AnalyticsEvent] = [];
        var count = 0;
        
        for ((_, event) in events.entries()) {
            if (count >= max_results) {
                return results;
            };
            
            if (Principal.equal(event.principal, principal)) {
                results := Array.append<Types.AnalyticsEvent>(results, [event]);
                count += 1;
            };
        };
        
        results
    };
    
    /// Get events by type
    public query func get_events_by_type(
        event_type : Types.EventType,
        limit : ?Nat
    ) : async [Types.AnalyticsEvent] {
        let max_results = switch (limit) {
            case (?l) { if (l > 100) { 100 } else { l } };
            case null { 10 };
        };
        
        var results : [Types.AnalyticsEvent] = [];
        var count = 0;
        
        for ((_, event) in events.entries()) {
            if (count >= max_results) {
                return results;
            };
            
            if (event.event_type == event_type) {
                results := Array.append<Types.AnalyticsEvent>(results, [event]);
                count += 1;
            };
        };
        
        results
    };
    
    /// Get recent events
    public query func get_recent_events(limit : ?Nat) : async [Types.AnalyticsEvent] {
        let max_results = switch (limit) {
            case (?l) { if (l > 100) { 100 } else { l } };
            case null { 20 };
        };
        
        var results : [Types.AnalyticsEvent] = [];
        var count = 0;
        
        // Simple implementation - in production would sort by timestamp
        for ((_, event) in events.entries()) {
            if (count >= max_results) {
                return results;
            };
            
            results := Array.append<Types.AnalyticsEvent>(results, [event]);
            count += 1;
        };
        
        results
    };
    
    /// Get analytics summary
    public query func get_analytics_summary() : async {
        total_events : Nat;
        deposits_count : Nat;
        withdrawals_count : Nat;
        total_deposit_volume : Nat;
        total_withdrawal_volume : Nat;
        unique_users : Nat;
    } {
        var deposits_count = 0;
        var withdrawals_count = 0;
        var total_deposit_volume = 0;
        var total_withdrawal_volume = 0;
        var unique_principals = HashMap.HashMap<Principal, Bool>(0, Principal.equal, Principal.hash);
        
        for ((_, event) in events.entries()) {
            // Track unique users
            unique_principals.put(event.principal, true);
            
            // Count event types and volumes
            switch (event.event_type) {
                case (#Deposit) {
                    deposits_count += 1;
                    switch (event.amount) {
                        case (?amount) { total_deposit_volume += amount };
                        case null { /* Skip */ };
                    };
                };
                case (#Withdraw) {
                    withdrawals_count += 1;
                    switch (event.amount) {
                        case (?amount) { total_withdrawal_volume += amount };
                        case null { /* Skip */ };
                    };
                };
                case (_) { /* Other event types */ };
            };
        };
        
        {
            total_events = events.size();
            deposits_count = deposits_count;
            withdrawals_count = withdrawals_count;
            total_deposit_volume = total_deposit_volume;
            total_withdrawal_volume = total_withdrawal_volume;
            unique_users = unique_principals.size();
        }
    };
    
    /// Get event by ID
    public query func get_event(id : Nat) : async ?Types.AnalyticsEvent {
        events.get(id)
    };
    
    /// Get events by alias (requires alias lookup)
    public query func get_events_by_alias(alias : Text, limit : ?Nat) : async [Types.AnalyticsEvent] {
        let max_results = switch (limit) {
            case (?l) { if (l > 100) { 100 } else { l } };
            case null { 10 };
        };
        
        var results : [Types.AnalyticsEvent] = [];
        var count = 0;
        
        for ((_, event) in events.entries()) {
            if (count >= max_results) {
                return results;
            };
            
            switch (event.alias) {
                case (?event_alias) {
                    if (event_alias == alias) {
                        results := Array.append<Types.AnalyticsEvent>(results, [event]);
                        count += 1;
                    };
                };
                case null { /* Skip events without alias */ };
            };
        };
        
        results
    };
    
    // ============ ADMIN FUNCTIONS ============
    
    /// Add admin principal (admin only)
    public shared(msg) func add_admin(new_admin : Principal) : async Bool {
        if (admin_principals.size() == 0 or is_admin(msg.caller)) {
            admin_principals := Array.append<Principal>(admin_principals, [new_admin]);
            true
        } else {
            false
        }
    };
    
    /// Clear old events (admin only)
    public shared(msg) func clear_events_before(timestamp : Int) : async Bool {
        if (not is_admin(msg.caller)) {
            return false;
        };
        
        var new_events = HashMap.HashMap<Nat, Types.AnalyticsEvent>(0, Nat.equal, func(n : Nat) : Nat32 { Nat32.fromNat(n % (2**32 - 1)) });
        
        for ((id, event) in events.entries()) {
            if (event.timestamp > timestamp) {
                new_events.put(id, event);
            };
        };
        
        events := new_events;
        true
    };
    
    /// Get total event count
    public query func get_event_count() : async Nat {
        events.size()
    };
    
    /// Export all events (admin only, for backup)
    public shared(msg) func export_all_events() : async ?[Types.AnalyticsEvent] {
        if (not is_admin(msg.caller)) {
            return null;
        };
        
        var results : [Types.AnalyticsEvent] = [];
        for ((_, event) in events.entries()) {
            results := Array.append<Types.AnalyticsEvent>(results, [event]);
        };
        
        ?results
    };
}
