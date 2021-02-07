export const capitalizeFirst = (str: string) => {
  const strs: string[] = [];
  str.split(/\s/g).forEach((s) => strs.push(s[0].toUpperCase() + s.slice(1)));
  return strs.join(' ');
};
