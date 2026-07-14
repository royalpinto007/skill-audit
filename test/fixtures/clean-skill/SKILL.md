---
name: markdown-formatter
description: Formats markdown files to a consistent style
---

# Markdown Formatter

This skill formats markdown files. It reads a file, normalizes headings and list
markers, wraps long lines, and returns the result.

## Usage

Point it at a `.md` file and it returns the formatted text. It works purely on the
text you give it and produces a formatted copy.

## Notes

The formatter is deterministic: the same input always yields the same output.
