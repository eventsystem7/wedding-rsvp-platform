'use client';

import React, { useState } from 'react';
// @ts-ignore
import Papa from 'papaparse';

interface Guest {
  name: string;
  phone: string;
  email?: string;
}

interface CSVImportProps {
  onImport: (guests: Guest[]) => void;
  isLoading: boolean;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onImport, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data as any[];
        const formattedGuests: Guest[] = data
          .filter((row) => row.name && row.phone)
          .map((row) => ({
            name: row.name.trim(),
            phone: row.phone.trim().replace(/\D/g, ''), // Clean phone
            email: row.email?.trim() || '',
          }));

        if (formattedGuests.length === 0) {
          setError('No valid guests found. Ensure columns are "name" and "phone".');
          return;
        }

        onImport(formattedGuests);
        e.target.value = ''; // Reset input
      },
      error: (err: any) => {
        setError(`CSV Parse error: ${err.message}`);
      },
    });
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex flex-col items-center">
        <label className="cursor-pointer">
          <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {isLoading ? 'Importing...' : 'Upload CSV'}
          </span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
        </label>
        <p className="mt-2 text-sm text-gray-500">
          Upload a CSV file with "name" and "phone" columns.
        </p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};
