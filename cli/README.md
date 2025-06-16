# Create ICP App

A command-line interface (CLI) for easily creating Internet Computer Protocol (ICP) applications based on our established boilerplate.

![Create ICP App Demo](./assets/example.gif)

## Installation

You can install this package globally using npm:

```bash
npm install -g create-icp-app
```

Or run it directly using npx (recommended for latest version):

```bash
npx create-icp-app my-app
```

## Quick Start

```bash
# Create a new ICP app
npx create-icp-app my-awesome-project

# Navigate to your project
cd my-awesome-project

# Start the development server
npm run dev
```

## Usage

### Creating a new app

To create a new ICP application:

```bash
create-icp-app my-icp-app
```

This will:

1. Create a new directory called `my-icp-app` in your current folder
2. Clone the boilerplate repository into that directory
3. Install all necessary dependencies
4. Configure the project with the name you provided

### Interactive Mode

If you run the CLI without any arguments, it will start in interactive mode:

```bash
create-icp-app
```

You'll be prompted to:
- Enter a project name
- Choose a template
- Confirm directory creation if it already exists

### Available Options

- `-t, --template <type>` - Specify a template variant (default: standard)
- `--help` - Display help information
- `--version` - Display version information
- `env` - Display environment information

## Features

This boilerplate includes:

- React frontend with TypeScript
- Motoko backend canister setup
- Internet Identity authentication integration
- TailwindCSS for styling
- Vite for fast development
- Pre-configured DFX settings

## Project Structure

Upon creation, your project will have this structure:

```
my-icp-app/
├── README.md             # Project documentation
├── dfx.json              # DFINITY configuration
├── mops.toml             # Motoko package manager config
├── package.json          # Workspace root package
├── backend/              # Backend Motoko code
│   ├── app.mo
│   ├── canisters/
│   └── types/
└── frontend/             # Frontend React code
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/
    │   ├── hooks/
    │   └── pages/
    ├── public/
    ├── index.html
    └── package.json
```

## Requirements

- Node.js 16 or higher
- dfx (DFINITY Canister SDK)
- Git

## Development

To contribute to this CLI:

1. Clone this repository
2. Run `npm install` to install dependencies
3. Make your changes
4. Test your changes by running `node scripts/test-cli.js`
5. Run `npm run prepare-publish` to validate the package

### Local Testing

To test the CLI locally without publishing:

```bash
# From the CLI directory
npm link
create-icp-app test-project

# When done testing
npm unlink
```

## License

MIT
