#!/usr/bin/env node

import { LLMGuard, GuardConfig } from './index';
import * as fs from 'fs';
import * as path from 'path';

interface CliOptions {
  config?: string;
  pii?: boolean;
  jailbreak?: boolean;
  profanity?: boolean;
  promptInjection?: boolean;
  relevance?: boolean;
  toxicity?: boolean;
  batch?: boolean;
  help?: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--config' || arg === '-c') {
      options.config = args[++i];
    } else if (arg === '--pii') {
      options.pii = true;
    } else if (arg === '--no-pii') {
      options.pii = false;
    } else if (arg === '--jailbreak') {
      options.jailbreak = true;
    } else if (arg === '--no-jailbreak') {
      options.jailbreak = false;
    } else if (arg === '--profanity') {
      options.profanity = true;
    } else if (arg === '--no-profanity') {
      options.profanity = false;
    } else if (arg === '--prompt-injection') {
      options.promptInjection = true;
    } else if (arg === '--no-prompt-injection') {
      options.promptInjection = false;
    } else if (arg === '--relevance') {
      options.relevance = true;
    } else if (arg === '--no-relevance') {
      options.relevance = false;
    } else if (arg === '--toxicity') {
      options.toxicity = true;
    } else if (arg === '--no-toxicity') {
      options.toxicity = false;
    } else if (arg === '--batch' || arg === '-b') {
      options.batch = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }
  
  return options;
}

function loadConfig(configPath: string): GuardConfig {
  try {
    const ext = path.extname(configPath).toLowerCase();
    const content = fs.readFileSync(configPath, 'utf8');
    
    if (ext === '.json') {
      return JSON.parse(content);
    } else if (ext === '.yaml' || ext === '.yml') {
      // We would need to add yaml package as a dependency
      console.error('YAML config files are not supported yet. Please use JSON.');
      process.exit(1);
    } else {
      console.error(`Unsupported config file format: ${ext}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`Error loading config file: ${error.message || 'Unknown error'}`);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
llm-guard - LLM prompt validation and security checks

Usage:
  llm-guard [options] <prompt>

Options:
  --config, -c <file>     Path to config file (JSON)
  --pii                   Enable PII detection
  --no-pii                Disable PII detection
  --jailbreak             Enable jailbreak detection
  --no-jailbreak          Disable jailbreak detection
  --profanity             Enable profanity filtering
  --no-profanity          Disable profanity filtering
  --prompt-injection      Enable prompt injection detection
  --no-prompt-injection   Disable prompt injection detection
  --relevance             Enable relevance checking
  --no-relevance          Disable relevance checking
  --toxicity              Enable toxicity detection
  --no-toxicity           Disable toxicity detection
  --batch, -b             Run in batch mode (expects JSON array of prompts)
  --help, -h              Show this help message

Examples:
  llm-guard "Your prompt here"
  llm-guard --config config.json "Your prompt here"
  llm-guard --pii --jailbreak "Your prompt here"
  llm-guard --batch '["First prompt", "Second prompt"]'
  `);
}

async function main() {
  const options = parseArgs();
  
  if (options.help) {
    printHelp();
    return;
  }
  
  // Get the prompt from stdin if not provided as an argument
  let prompt: string | string[] = '';
  if (process.stdin.isTTY) {
    // If running in a terminal, get the last argument as the prompt
    const args = process.argv.slice(2);
    const lastArg = args[args.length - 1];
    
    if (!lastArg || lastArg.startsWith('--')) {
      console.error('Please provide a prompt to validate');
      printHelp();
      process.exit(1);
    }
    
    prompt = lastArg;
  } else {
    // If running with stdin, read from stdin
    prompt = fs.readFileSync(0, 'utf8').trim();
  }
  
  // Load config if provided
  let config: GuardConfig = {};
  if (options.config) {
    config = loadConfig(options.config);
  }
  
  // Override config with command line options
  if (options.pii !== undefined) config.pii = options.pii;
  if (options.jailbreak !== undefined) config.jailbreak = options.jailbreak;
  if (options.profanity !== undefined) config.profanity = options.profanity;
  if (options.promptInjection !== undefined) config.promptInjection = options.promptInjection;
  if (options.relevance !== undefined) config.relevance = options.relevance;
  if (options.toxicity !== undefined) config.toxicity = options.toxicity;
  
  try {
    const guard = new LLMGuard(config);
    
    if (options.batch) {
      // Parse JSON array if in batch mode
      try {
        const prompts = typeof prompt === 'string' ? JSON.parse(prompt) : prompt;
        if (!Array.isArray(prompts)) {
          throw new Error('Batch mode expects a JSON array of prompts');
        }
        const result = await guard.validateBatch(prompts);
        console.log(JSON.stringify(result, null, 2));
      } catch (error: any) {
        console.error(`Error parsing batch input: ${error.message || 'Unknown error'}`);
        process.exit(1);
      }
    } else {
      // Single prompt validation
      const result = await guard.validate(prompt as string);
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error: any) {
    console.error('Error:', error.message || 'Unknown error');
    process.exit(1);
  }
}

main(); 