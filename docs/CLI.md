# ICP Boilerplate CLI Tool

The `create-icp-app` CLI tool allows you to quickly scaffold new ICP projects based on this boilerplate.

## Installation

```bash
npm install -g create-icp-app
```

Or use directly with npx (recommended):

```bash
npx create-icp-app my-new-project
```

## Features

- Interactive project creation
- Multiple template options
- Automatic dependency installation
- Project configuration
- DFX setup
- Environment validation

## Usage

### Basic Usage

```bash
npx create-icp-app my-project
```

### Templates

You can specify a template with the `-t` or `--template` flag:

```bash
npx create-icp-app my-project --template standard
```

Available templates:
- `standard`: Full-featured React + Motoko application (default)
- `minimal`: Minimal ICP application setup

### Environment Information

Check your system compatibility:

```bash
npx create-icp-app env
```

## Development

To contribute to the CLI:

1. Clone this repository
2. Navigate to the CLI directory: `cd cli`
3. Install dependencies: `npm install`
4. Make your changes
5. Test locally: `npm run test-cli`

### Publishing

1. Update the version in package.json
2. Run `npm run prepare-publish` to validate the package
3. Publish to npm: `npm publish`
