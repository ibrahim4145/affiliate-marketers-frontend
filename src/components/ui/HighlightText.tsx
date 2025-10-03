import React from 'react';

interface HighlightTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export default function HighlightText({ text, searchTerm, className = "" }: HighlightTextProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>;
  }

  // Create a regex that's case-insensitive and escapes special regex characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        return isMatch ? (
          <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </span>
  );
}
