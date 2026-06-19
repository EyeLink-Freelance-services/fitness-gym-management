import type {
  FormulaDefinition,
  FormulaValidationResult,
} from "@/types/dashboard/formula-builder";
import { extractExpressionVariables, getFormulaDependencies } from "./variable-utils";

type NumericScope = Record<string, number>;

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "^" | "u-" }
  | { type: "leftParen"; value: "(" }
  | { type: "rightParen"; value: ")" }
  | { type: "comma"; value: "," };

const SAFE_EXPRESSION_PATTERN = /^[a-zA-Z0-9\s+\-*/^().,_]+$/;
const BLOCKED_PATTERN =
  /\b(import|require|process|eval|Function|fetch|XMLHttpRequest)\b/gi;

const FUNCTION_ARITY: Record<string, number> = {
  abs: 1,
  ceil: 1,
  cos: 1,
  exp: 1,
  floor: 1,
  log: 1,
  log10: 1,
  max: 2,
  min: 2,
  pow: 2,
  round: 1,
  sin: 1,
  sqrt: 1,
  tan: 1,
};

const CONSTANTS: NumericScope = {
  e: Math.E,
  pi: Math.PI,
};

const FUNCTION_IMPL: Record<string, (...args: number[]) => number> = {
  abs: Math.abs,
  ceil: Math.ceil,
  cos: Math.cos,
  exp: Math.exp,
  floor: Math.floor,
  log: Math.log,
  log10: Math.log10,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  round: Math.round,
  sin: Math.sin,
  sqrt: Math.sqrt,
  tan: Math.tan,
};

const OPERATOR_PRECEDENCE: Record<Extract<Token, { type: "operator" }>["value"], number> =
  {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
    "u-": 4,
  };

const RIGHT_ASSOCIATIVE = new Set(["^", "u-"]);

function sanitizeExpression(expression: string): string {
  const trimmed = expression.trim();

  if (!trimmed) {
    throw new Error("Expression is required.");
  }

  if (trimmed.length > 500) {
    throw new Error("Expression is too long.");
  }

  if (BLOCKED_PATTERN.test(trimmed)) {
    throw new Error("Blocked keyword in expression.");
  }

  if (!SAFE_EXPRESSION_PATTERN.test(trimmed)) {
    throw new Error("Expression contains unsupported characters.");
  }

  return trimmed;
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < expression.length) {
    const char = expression[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      const start = index;
      index += 1;

      while (index < expression.length && /[0-9.]/.test(expression[index])) {
        index += 1;
      }

      const raw = expression.slice(start, index);
      const value = Number(raw);

      if (Number.isNaN(value)) {
        throw new Error(`Invalid number token "${raw}".`);
      }

      tokens.push({ type: "number", value });
      continue;
    }

    if (/[a-zA-Z_]/.test(char)) {
      const start = index;
      index += 1;

      while (index < expression.length && /[a-zA-Z0-9_]/.test(expression[index])) {
        index += 1;
      }

      tokens.push({
        type: "identifier",
        value: expression.slice(start, index),
      });
      continue;
    }

    if (char === "(") {
      tokens.push({ type: "leftParen", value: "(" });
      index += 1;
      continue;
    }

    if (char === ")") {
      tokens.push({ type: "rightParen", value: ")" });
      index += 1;
      continue;
    }

    if (char === ",") {
      tokens.push({ type: "comma", value: "," });
      index += 1;
      continue;
    }

    if (["+", "-", "*", "/", "^"].includes(char)) {
      const previous = tokens.at(-1);
      const isUnaryMinus =
        char === "-" &&
        (!previous ||
          previous.type === "operator" ||
          previous.type === "leftParen" ||
          previous.type === "comma");

      tokens.push({
        type: "operator",
        value: isUnaryMinus ? "u-" : (char as "+" | "-" | "*" | "/" | "^"),
      });
      index += 1;
      continue;
    }

    throw new Error(`Unexpected token "${char}".`);
  }

  return tokens;
}

function toRpn(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];

    if (token.type === "number") {
      output.push(token);
      continue;
    }

    if (token.type === "identifier") {
      if (next?.type === "leftParen") {
        stack.push(token);
      } else {
        output.push(token);
      }
      continue;
    }

    if (token.type === "comma") {
      while (stack.length && stack.at(-1)?.type !== "leftParen") {
        output.push(stack.pop() as Token);
      }

      if (!stack.length) {
        throw new Error("Unexpected comma in expression.");
      }
      continue;
    }

    if (token.type === "operator") {
      while (stack.length) {
        const top = stack.at(-1) as Token;

        if (top.type !== "operator") {
          break;
        }

        const shouldPop = RIGHT_ASSOCIATIVE.has(token.value)
          ? OPERATOR_PRECEDENCE[token.value] < OPERATOR_PRECEDENCE[top.value]
          : OPERATOR_PRECEDENCE[token.value] <= OPERATOR_PRECEDENCE[top.value];

        if (!shouldPop) {
          break;
        }

        output.push(stack.pop() as Token);
      }

      stack.push(token);
      continue;
    }

    if (token.type === "leftParen") {
      stack.push(token);
      continue;
    }

    if (token.type === "rightParen") {
      while (stack.length && stack.at(-1)?.type !== "leftParen") {
        output.push(stack.pop() as Token);
      }

      if (!stack.length) {
        throw new Error("Mismatched parenthesis in expression.");
      }

      stack.pop();

      if (stack.at(-1)?.type === "identifier") {
        output.push(stack.pop() as Token);
      }
    }
  }

  while (stack.length) {
    const token = stack.pop() as Token;

    if (token.type === "leftParen" || token.type === "rightParen") {
      throw new Error("Mismatched parenthesis in expression.");
    }

    output.push(token);
  }

  return output;
}

function evaluateRpn(tokens: Token[], variables: NumericScope): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }

    if (token.type === "identifier") {
      if (token.value in FUNCTION_IMPL) {
        const arity = FUNCTION_ARITY[token.value];
        const args = stack.splice(-arity);

        if (args.length !== arity) {
          throw new Error(`Function "${token.value}" is missing arguments.`);
        }

        stack.push(FUNCTION_IMPL[token.value](...args));
        continue;
      }

      const resolved = variables[token.value] ?? CONSTANTS[token.value];

      if (resolved === undefined) {
        throw new Error(`Unknown variable "${token.value}".`);
      }

      stack.push(resolved);
      continue;
    }

    if (token.type === "operator") {
      if (token.value === "u-") {
        const value = stack.pop();

        if (value === undefined) {
          throw new Error("Unary minus is missing a value.");
        }

        stack.push(-value);
        continue;
      }

      const right = stack.pop();
      const left = stack.pop();

      if (left === undefined || right === undefined) {
        throw new Error(`Operator "${token.value}" is missing values.`);
      }

      switch (token.value) {
        case "+":
          stack.push(left + right);
          break;
        case "-":
          stack.push(left - right);
          break;
        case "*":
          stack.push(left * right);
          break;
        case "/":
          stack.push(left / right);
          break;
        case "^":
          stack.push(left ** right);
          break;
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error("Expression could not be evaluated.");
  }

  const result = stack[0];

  if (!Number.isFinite(result)) {
    throw new Error("Expression returned an invalid number.");
  }

  return result;
}

export function evaluateFormulaPreview(
  expression: string,
  variables: NumericScope,
): number {
  const sanitized = sanitizeExpression(expression);
  const tokens = tokenize(sanitized);
  const rpn = toRpn(tokens);

  return evaluateRpn(rpn, variables);
}

export function topologicalSortFormulas(
  formulas: Pick<FormulaDefinition, "key" | "label" | "expression">[],
): Pick<FormulaDefinition, "key" | "label" | "expression">[] {
  const dependencies = getFormulaDependencies(formulas);
  const inDegree = new Map<string, number>();
  const graph = new Map<string, string[]>();

  for (const formula of formulas) {
    inDegree.set(formula.key, 0);
    graph.set(formula.key, []);
  }

  for (const formula of formulas) {
    const deps = dependencies.get(formula.key) ?? [];

    for (const dep of deps) {
      graph.get(dep)?.push(formula.key);
      inDegree.set(formula.key, (inDegree.get(formula.key) ?? 0) + 1);
    }
  }

  const queue = formulas.filter((formula) => (inDegree.get(formula.key) ?? 0) === 0);
  const sorted: Pick<FormulaDefinition, "key" | "label" | "expression">[] = [];

  while (queue.length) {
    const current = queue.shift() as Pick<
      FormulaDefinition,
      "key" | "label" | "expression"
    >;

    sorted.push(current);

    for (const neighbor of graph.get(current.key) ?? []) {
      const nextCount = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextCount);

      if (nextCount === 0) {
        const target = formulas.find((formula) => formula.key === neighbor);

        if (target) {
          queue.push(target);
        }
      }
    }
  }

  if (sorted.length !== formulas.length) {
    throw new Error("Circular dependency detected.");
  }

  return sorted;
}

export function evaluateFormulaCollection(
  formulas: Pick<FormulaDefinition, "key" | "label" | "expression">[],
  fieldValues: NumericScope,
): NumericScope {
  const sorted = topologicalSortFormulas(formulas);
  const scope = { ...fieldValues };

  for (const formula of sorted) {
    scope[formula.key] = evaluateFormulaPreview(formula.expression, scope);
  }

  return scope;
}

export function validateFormulaExpression(
  expression: string,
  knownKeys: string[],
  formulas: Pick<FormulaDefinition, "key" | "expression">[] = [],
  sampleValues?: NumericScope,
): FormulaValidationResult {
  try {
    const sanitized = sanitizeExpression(expression);
    const detectedVariables = extractExpressionVariables(sanitized);
    const unknownVariables = detectedVariables.filter(
      (variable) => !knownKeys.includes(variable),
    );

    if (unknownVariables.length) {
      return {
        valid: false,
        detectedVariables,
        unknownVariables,
        circularDependencies: [],
        error: `Unknown variables: ${unknownVariables.join(", ")}`,
      };
    }

    try {
      topologicalSortFormulas(
        formulas.map((formula) => ({
          ...formula,
          label: formula.key,
        })),
      );
    } catch (error) {
      return {
        valid: false,
        detectedVariables,
        unknownVariables,
        circularDependencies: formulas.map((formula) => formula.key),
        error:
          error instanceof Error ? error.message : "Circular dependency detected.",
      };
    }

    const previewResult = sampleValues
      ? evaluateFormulaPreview(sanitized, sampleValues)
      : undefined;

    return {
      valid: true,
      detectedVariables,
      unknownVariables: [],
      circularDependencies: [],
      previewResult,
    };
  } catch (error) {
    return {
      valid: false,
      detectedVariables: [],
      unknownVariables: [],
      circularDependencies: [],
      error: error instanceof Error ? error.message : "Expression is invalid.",
    };
  }
}
