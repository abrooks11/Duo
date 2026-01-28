export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const BLOCKED_KEYWORDS = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'ALTER',
  'CREATE',
  'TRUNCATE',
  'EXEC',
  'EXECUTE',
  'GRANT',
  'REVOKE',
  'COMMIT',
  'ROLLBACK',
  'SAVEPOINT',
  'MERGE',
  'CALL',
  'COPY',
  'LOAD',
  'VACUUM',
  'REINDEX',
  'CLUSTER',
  'COMMENT',
  'LOCK',
  'UNLOCK',
  'SET ',
  'RESET',
];

export function validateSelectOnly(sql: string): ValidationResult {
  if (!sql || typeof sql !== 'string') {
    return { valid: false, error: 'Query must be a non-empty string' };
  }

  const normalized = sql.trim().toUpperCase();

  // Must start with SELECT or WITH (for CTEs)
  if (!normalized.startsWith('SELECT') && !normalized.startsWith('WITH')) {
    return { valid: false, error: 'Only SELECT queries are allowed' };
  }

  // Check for blocked keywords
  for (const keyword of BLOCKED_KEYWORDS) {
    // Use word boundary check to avoid false positives
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(normalized)) {
      return { valid: false, error: `Query contains forbidden keyword: ${keyword.trim()}` };
    }
  }

  // Check for semicolons (could indicate multiple statements)
  const semicolonCount = (sql.match(/;/g) || []).length;
  if (semicolonCount > 1) {
    return { valid: false, error: 'Multiple statements are not allowed' };
  }

  // Check for comments that might hide malicious code
  if (sql.includes('--') || sql.includes('/*')) {
    return { valid: false, error: 'SQL comments are not allowed' };
  }

  return { valid: true };
}

export function ensureLimitClause(sql: string, maxRows: number = 500): string {
  const normalized = sql.trim().toUpperCase();

  // Check if LIMIT already exists
  if (normalized.includes('LIMIT')) {
    // Extract existing limit and ensure it's not higher than maxRows
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const existingLimit = parseInt(limitMatch[1], 10);
      if (existingLimit > maxRows) {
        // Replace with maxRows
        return sql.replace(/LIMIT\s+\d+/i, `LIMIT ${maxRows}`);
      }
    }
    return sql;
  }

  // Add LIMIT clause
  // Remove trailing semicolon if present
  let cleanSql = sql.trim();
  if (cleanSql.endsWith(';')) {
    cleanSql = cleanSql.slice(0, -1).trim();
  }

  return `${cleanSql} LIMIT ${maxRows}`;
}
