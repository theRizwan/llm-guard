# Testing LLM-Guard Locally

This directory contains examples and test scripts for testing the `llm-guard` package locally.

## Prerequisites

Before running the tests, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/llm-guard.git
   cd llm-guard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the package:
   ```bash
   npm run build
   ```

## Running the Tests

### Basic Test

The `local-test.ts` script tests the basic functionality of the package:

```bash
npx ts-node examples/local-test.ts
```

This will run several tests with different types of prompts and display the validation results.

### CLI Test

The `cli-test.sh` script tests the command-line interface:

```bash
# Make the script executable
chmod +x examples/cli-test.sh

# Run the script
./examples/cli-test.sh
```

This will test the CLI with various prompts and options.

### Web API Test

The `web-api-test.ts` script tests the web API integration:

```bash
npx ts-node examples/web-api-test.ts
```

This will start a local web server and test the API endpoints with various prompts.

### Advanced Usage Test

The `advanced-usage.ts` script demonstrates more advanced usage of the package:

```bash
npx ts-node examples/advanced-usage.ts
```

This will run several examples with custom configurations and batch processing.

### Real-World Usage Test

The `real-world-usage.ts` script demonstrates how to use the package in a real-world application:

```bash
npx ts-node examples/real-world-usage.ts
```

This will simulate a secure LLM application that validates prompts before sending them to an LLM API.

## React Integration

The `react-integration.tsx` file demonstrates how to use the package in a React application. To run this example, you'll need to:

1. Install React and its dependencies:
   ```bash
   npm install react react-dom @types/react @types/react-dom
   ```

2. Set up a React application (e.g., using Create React App or Next.js)
3. Copy the `react-integration.tsx` file to your React application
4. Import and use the `SecureLLMComponent` in your application

## Troubleshooting

If you encounter any issues while running the tests:

1. Make sure all dependencies are installed correctly
2. Check that the package is built correctly
3. Ensure you're using the correct Node.js version
4. Check the console for error messages

## Additional Resources

- [Package Documentation](../README.md)
- [API Reference](../docs/API.md)
- [Configuration Options](../docs/CONFIGURATION.md) 