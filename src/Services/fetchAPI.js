const awsomeApiFetch = async () => {
  const url = 'https://economia.awesomeapi.com.br/json/all';

  const request = await fetch(url);
  const response = await request.json();
  return response;
};

export default awsomeApiFetch;
