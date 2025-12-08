
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(fieldName => {
        const value = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
        // Escape quotes and wrap in quotes
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  // Remove potential BOM and trim
  const cleanHeader = lines[0].trim().replace(/^\ufeff/, '');
  const headers = cleanHeader.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  
  const result: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple parser: doesn't handle commas inside quotes perfectly, but sufficient for this demo
    // For production, use a library like PapaParse
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const values = matches.map(m => m.replace(/^"|"$/g, '').trim());

    // Fallback split if regex fails (simple CSV)
    const simpleValues = line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    
    const finalValues = values.length === headers.length ? values : simpleValues;

    if (finalValues.length > 0) {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = finalValues[index] || '';
      });
      result.push(obj);
    }
  }
  return result;
};
