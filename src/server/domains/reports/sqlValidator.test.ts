import { describe, it, expect } from 'vitest';
import { validateSelectOnly, ensureLimitClause } from './sqlValidator.ts';

describe('validateSelectOnly', () => {
  describe('valid queries', () => {
    it('accepts a simple SELECT query', () => {
      const result = validateSelectOnly('SELECT * FROM "Patient"');
      expect(result).toEqual({ valid: true });
    });

    it('accepts a SELECT with WHERE clause', () => {
      const result = validateSelectOnly(
        'SELECT id, patientFullName FROM "Patient" WHERE id = 1'
      );
      expect(result).toEqual({ valid: true });
    });

    it('accepts a WITH (CTE) query', () => {
      const result = validateSelectOnly(
        'WITH recent AS (SELECT * FROM "Appointment") SELECT * FROM recent'
      );
      expect(result).toEqual({ valid: true });
    });

    it('accepts a query with a single trailing semicolon', () => {
      const result = validateSelectOnly('SELECT 1;');
      expect(result).toEqual({ valid: true });
    });

    it('accepts a SELECT with JOINs', () => {
      const result = validateSelectOnly(
        'SELECT p.patientFullName, a.startDate FROM "Patient" p JOIN "Appointment" a ON p.id = a."patientId"'
      );
      expect(result).toEqual({ valid: true });
    });
  });

  describe('empty / non-string input', () => {
    it('rejects an empty string', () => {
      const result = validateSelectOnly('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Query must be a non-empty string');
    });

    it('rejects null cast to string type', () => {
      const result = validateSelectOnly(null as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Query must be a non-empty string');
    });
  });

  describe('blocked DDL / DML keywords', () => {
    it('rejects a query starting with INSERT', () => {
      const result = validateSelectOnly('INSERT INTO "Patient" VALUES (1)');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only SELECT queries are allowed');
    });

    it('rejects a query starting with UPDATE', () => {
      const result = validateSelectOnly("UPDATE \"Patient\" SET name = 'x'");
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only SELECT queries are allowed');
    });

    it('rejects a query starting with DELETE', () => {
      const result = validateSelectOnly('DELETE FROM "Patient"');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only SELECT queries are allowed');
    });

    it('rejects DROP embedded in a SELECT', () => {
      const result = validateSelectOnly('SELECT 1; DROP TABLE "Patient"');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects TRUNCATE embedded in a SELECT', () => {
      const result = validateSelectOnly('SELECT 1; TRUNCATE TABLE "Patient"');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects ALTER embedded in a SELECT', () => {
      const result = validateSelectOnly(
        "SELECT 1; ALTER TABLE \"Patient\" ADD COLUMN foo TEXT"
      );
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects CREATE embedded in a SELECT', () => {
      const result = validateSelectOnly('SELECT 1; CREATE TABLE foo (id INT)');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects EXEC keyword', () => {
      const result = validateSelectOnly("SELECT EXEC('xp_cmdshell')");
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects EXECUTE keyword', () => {
      const result = validateSelectOnly('SELECT 1; EXECUTE proc');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects GRANT keyword', () => {
      const result = validateSelectOnly('SELECT 1; GRANT ALL ON "Patient" TO user');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });

    it('rejects REVOKE keyword', () => {
      const result = validateSelectOnly('SELECT 1; REVOKE ALL ON "Patient" FROM user');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('forbidden keyword');
    });
  });

  describe('stacked statements', () => {
    it('rejects two semicolons (stacked statements)', () => {
      const result = validateSelectOnly('SELECT 1; SELECT 2;');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Multiple statements are not allowed');
    });
  });

  describe('SQL comments', () => {
    it('rejects -- line comments', () => {
      const result = validateSelectOnly('SELECT * FROM "Patient" -- malicious');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('SQL comments are not allowed');
    });

    it('rejects /* block comments */', () => {
      // Use text that avoids the keyword scanner so the comment check fires
      const result = validateSelectOnly('SELECT /* hack */ 1');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('SQL comments are not allowed');
    });
  });

  describe('non-SELECT start', () => {
    it('rejects a query that does not start with SELECT or WITH', () => {
      const result = validateSelectOnly('SHOW TABLES');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only SELECT queries are allowed');
    });
  });
});

describe('ensureLimitClause', () => {
  it('appends LIMIT 500 when no LIMIT is present', () => {
    const result = ensureLimitClause('SELECT * FROM "Patient"');
    expect(result).toBe('SELECT * FROM "Patient" LIMIT 500');
  });

  it('uses a custom maxRows value', () => {
    const result = ensureLimitClause('SELECT * FROM "Patient"', 100);
    expect(result).toBe('SELECT * FROM "Patient" LIMIT 100');
  });

  it('does not double-add LIMIT when already present and within bound', () => {
    const sql = 'SELECT * FROM "Patient" LIMIT 50';
    expect(ensureLimitClause(sql, 500)).toBe(sql);
  });

  it('replaces an existing LIMIT that exceeds maxRows', () => {
    const result = ensureLimitClause('SELECT * FROM "Patient" LIMIT 1000', 500);
    expect(result).toBe('SELECT * FROM "Patient" LIMIT 500');
  });

  it('strips a trailing semicolon before appending LIMIT', () => {
    const result = ensureLimitClause('SELECT * FROM "Patient";');
    expect(result).toBe('SELECT * FROM "Patient" LIMIT 500');
  });

  it('preserves an existing LIMIT that equals maxRows exactly', () => {
    const sql = 'SELECT * FROM "Patient" LIMIT 500';
    expect(ensureLimitClause(sql, 500)).toBe(sql);
  });

  it('defaults maxRows to 500 when not provided', () => {
    const result = ensureLimitClause('SELECT 1');
    expect(result).toBe('SELECT 1 LIMIT 500');
  });
});
