export function replaceNestedParentheses(input: string) {
  let result = input
  let hasChanges = true

  while (hasChanges) {
    hasChanges = false
    const functionMatches = findAllFunctions(result)

    functionMatches.sort((a, b) => {
      if (a.depth !== b.depth) return b.depth - a.depth
      return b.start - a.start
    })

    for (const func of functionMatches) {
      const beforeFunction = result.substring(0, func.openParenIndex + 1)
      const functionContent = result.substring(func.openParenIndex + 1, func.closeParenIndex)
      const afterFunction = result.substring(func.closeParenIndex)

      const nestedFunctions = findNestedFunctionsInContent(functionContent)
      const modifiedContent = replaceContentParentheses(functionContent, nestedFunctions)

      if (modifiedContent !== functionContent) {
        hasChanges = true
        result = beforeFunction + modifiedContent + afterFunction
        break
      }
    }
  }

  result = replaceWholeNormalParentheses(result)
  return result
}


function replaceWholeNormalParentheses(text: string): string {
  const input = text
  let output = "";
  let skip = false;
  let depth = 0;

  for (let i = 0; i < input.length; i++) {
    if (!skip && input.startsWith("#avgNumber(", i)) {
      skip = true;
      depth = 0;
      output += "#avgNumber(";
      i += "#avgNumber(".length - 1;
      continue;
    } else if (!skip &&  input.startsWith("#avgSpectralDouble(", i)) {
      skip = true;
      depth = 0;
      output += "#avgSpectralDouble(";
      i += "#avgSpectralDouble(".length - 1;
      continue;
    } else if (!skip &&  input.startsWith("#avgMultiSelect(", i)) {
      skip = true;
      depth = 0;
      output += "#avgMultiSelect(";
      i += "#avgMultiSelect(".length - 1;
      continue;
    }


    if (skip) {
      if (input[i] === "(") depth++;
      if (input[i] === ")") {
        if (depth === 0) {
          skip = false;
          output += ")";
          continue;
        } else {
          depth--;
        }
      }
      output += input[i];
      continue;
    }

    if (input[i] === "(") {
      output += "$(";
    } else if (input[i] === ")") {
      output += ")$";
    } else {
      output += input[i];
    }
  }

  return output
}

function findAllFunctions(text: string) {
  const functions = []
  const functionPattern = /#\w+\(/g
  let match

  while ((match = functionPattern.exec(text)) !== null) {
    const startIndex = match.index
    const openParenIndex = match.index + match[0].length - 1

    const closeInfo = findMatchingCloseParen(text, openParenIndex)

    if (closeInfo.index !== -1) {
      functions.push({
        start: startIndex,
        functionName: match[0].slice(0, -1),
        openParenIndex: openParenIndex,
        closeParenIndex: closeInfo.index,
        depth: closeInfo.depth,
      })
    }
  }

  return functions
}

function findMatchingCloseParen(text: string, startIndex: number) {
  let depth = 1
  let maxDepth = 1
  let functionCount = 0

  for (let i = startIndex + 1; i < text.length; i++) {
    const char = text[i]
    const prevChar = i > 0 ? text[i - 1] : ""
    const nextChar = i < text.length - 1 ? text[i + 1] : ""

    if (char === "(" && prevChar !== "$") {
      depth++
      maxDepth = Math.max(maxDepth, depth)
    } else if (char === ")" && nextChar !== "$") {
      depth--
      if (depth === 0) {
        return { index: i, depth: maxDepth }
      }
    }

    if (char === "#" && /\w/.test(nextChar)) {
      functionCount++
    }
  }

  return { index: -1, depth: 0 }
}

function findNestedFunctionsInContent(content: string) {
  const nestedFunctions = []
  const functionPattern = /#\w+\(/g
  let match

  while ((match = functionPattern.exec(content)) !== null) {
    const startIndex = match.index
    const openParenIndex = match.index + match[0].length - 1

    const closeIndex = findMatchingCloseParenSimple(content, openParenIndex)

    if (closeIndex !== -1) {
      nestedFunctions.push({
        start: startIndex,
        openParen: openParenIndex,
        closeParen: closeIndex,
      })
    }
  }

  return nestedFunctions
}

function findMatchingCloseParenSimple(text: string, startIndex: number) {
  let depth = 1

  for (let i = startIndex + 1; i < text.length; i++) {
    const char = text[i]
    const prevChar = i > 0 ? text[i - 1] : ""
    const nextChar = i < text.length - 1 ? text[i + 1] : ""

    if (char === "(" && prevChar !== "$") {
      depth++
    } else if (char === ")" && nextChar !== "$") {
      depth--
      if (depth === 0) {
        return i
      }
    }
  }

  return -1
}

function replaceContentParentheses(content: string, nestedFunctions: any[]) {
  const protectedPositions = new Set()

  nestedFunctions.forEach((func) => {
    protectedPositions.add(func.openParen)
    protectedPositions.add(func.closeParen)
  })

  let result = ""

  for (let i = 0; i < content.length; i++) {
    const char = content[i]
    const prevChar = i > 0 ? content[i - 1] : ""
    const nextChar = i < content.length - 1 ? content[i + 1] : ""

    if (char === "(" && prevChar !== "$" && !protectedPositions.has(i)) {
      result += "$("
    } else if (char === ")" && nextChar !== "$" && !protectedPositions.has(i)) {
      result += ")$"
    } else {
      result += char
    }
  }

  return result
}
