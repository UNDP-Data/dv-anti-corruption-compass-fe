export const getDummyData = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  return response.json();
};
