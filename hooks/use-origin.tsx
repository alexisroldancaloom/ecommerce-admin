import { useEffect, useState } from 'react';

export const useOrigin = () => {
  const [monted, setMonted] = useState(false);
  const origin =
    typeof window != 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  useEffect(() => {
    setMonted(true);
  }, []);
  if (!monted) {
    return '';
  }
  return origin;
};
