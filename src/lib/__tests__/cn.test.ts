import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const condition = false;
    const otherCondition = true;
    expect(cn('foo', condition && 'bar')).toBe('foo');
    expect(cn('foo', otherCondition && 'bar')).toBe('foo bar');
  });

  it('merges Tailwind classes without conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn('', '')).toBe('');
  });

  it('handles null and undefined', () => {
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
  });

  it('handles arrays of classes', () => {
    const condition = false;
    expect(cn(['foo', 'bar'])).toBe('foo bar');
    expect(cn(['foo', condition && 'bar'])).toBe('foo');
  });

  it('handles complex Tailwind merging', () => {
    const result = cn(
      'text-red-500 bg-blue-500',
      'text-green-500',
      'p-4 m-2',
      'p-6'
    );
    expect(result).toBe('bg-blue-500 text-green-500 m-2 p-6');
  });
});
