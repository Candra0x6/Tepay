import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";

actor class Auth() {
  public shared func greet(name : Text) : async Text {
    let message = "Hello, " # name # "!";
    return message;
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  public type UserProfile = {
    principal : Principal;
    createdAt : Time.Time;
    lastLogin : ?Time.Time;
  };

  private var userProfiles = TrieMap.TrieMap<Principal, UserProfile>(Principal.equal, Principal.hash);

  public type AuthError = {
    #NotAuthorized;
    #ProfileNotFound;
    #AlreadyExists;
    #SessionExpired;
    #InvalidToken;
    #OperationFailed;
  };

  public shared (msg) func registerUser() : async Result.Result<UserProfile, AuthError> {
    let caller = msg.caller;

    let user : UserProfile = {
      principal = caller;
      createdAt = Time.now();
      lastLogin = null;
    };
    userProfiles.put(caller, user);

    return #ok(user);
  };

  public shared (_msg) func getUserByPrincipal(principal : Principal) : async ?UserProfile {
    return userProfiles.get(principal);
  };

};
