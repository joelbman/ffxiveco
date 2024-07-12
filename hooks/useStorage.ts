const LocalStorage = () => {
  const getItem = (name: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    return (localStorage.getItem(name) as string) || '';
  };

  const setItem = (name: string, value: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(name, value);
  };

  return {
    getItem,
    setItem,
  };
};

export default LocalStorage;
