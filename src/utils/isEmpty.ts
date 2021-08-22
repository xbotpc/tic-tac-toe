const isEmpty = (value: string | number | undefined | null): boolean => value === '' || value === 0 || value === undefined || value === null;

export default isEmpty;