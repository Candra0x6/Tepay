
# Tepay

**Tepay — Share your link. Grow your money.**

Tepay is a simple, fast, and fun way to create payment links using Internet Identity on the Internet Computer. Whether you’re receiving tips, collecting donations, or setting up quick transfers, Tepay makes it effortless and secure.

---

## 🚀 What is Tepay?

Tepay is a decentralized link-based payment tool built for the Internet Computer (ICP). With Tepay, anyone can:

* 🔗 Create custom payment links
* 💳 Receive money directly through shared links
* 🔒 Authenticate with Internet Identity
* 📈 Track balances and transaction history
* 🖼️ Personalize payment pages with your own icons and descriptions

---

## ✨ Features

* **Easy Login:** Secure authentication using Internet Identity
* **Dashboard Overview:** Check your balance, links, and activity all in one place
* **Link Creation:** Generate payment links in seconds
* **Custom Branding:** Add names, icons, and descriptions to personalize your links
* **Instant Transfers:** Send and receive ICP tokens quickly
* **Real-Time Activity:** View complete transaction history by account

---

## 🎯 Use Cases

* Creators accepting tips
* Fundraisers and campaigns
* Small businesses or freelancers
* Personal payments between friends

---

## Architecture Overview

The Tepay platform is built on the Internet Computer Protocol (ICP) using Motoko programming language. The backend consists of the following canisters:

1. **Alias Registry** - Manages user-friendly aliases for Principal IDs
2. **Analytics Logger** - Tracks and logs platform events and metrics
3. **Authentication** - Handles user authentication and profile management
4. **Token** - Implements ICRC-1 and ICRC-2 token standards
5. **Types** - Shared type definitions and utility functions

---

## Canister Documentation

- [Alias Registry](./docs/alias-registry.md) - User alias management system
- [Analytics Logger](./docs/analytics-logger.md) - Event tracking and analytics
- [Authentication](./docs/auth.md) - User authentication and profiles
- [Token](./docs/token.md) - ICRC-1/ICRC-2 token implementation
- [Types](./docs/types.md) - Shared type definitions

---

## Development

- Language: Motoko
- Runtime: Internet Computer Protocol (ICP)
- Package Manager: Mops (configured in `mops.toml`)

---

## Security Considerations

- All sensitive operations are protected by caller authentication
- Admin functions require explicit permission verification
- Rate limiting and validation are implemented for public endpoints
- Upgrade hooks preserve state during canister updates

---

## Inter-Canister Communication

The canisters are designed to work together, with the Analytics Logger recording events from other canisters, and the Alias Registry providing human-readable names for Principal IDs used throughout the system.

---


## 📦 Getting Started

Clone the repo and follow the instructions to run Tepay locally or deploy to your canister.

```bash
git clone https://github.com/your-org/tepay.git
cd tepay
dfx start --background
dfx deploy
```

More setup instructions coming soon in the [Docs](./docs).

---

## 🤝 Contributing

We welcome contributions!
Feel free to open issues, suggest features, or submit pull requests.

---

## 📄 License

MIT License.
See [LICENSE](./LICENSE) for details.

---

## 🙌 Team

- Kurniawan Candra Mahardika (Developer)
- Fahreza Andreansyah (Developer)
- Ardian Gymnastiar (Designer)

---
