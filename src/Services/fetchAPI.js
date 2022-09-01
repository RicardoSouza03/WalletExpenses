const awsomeApiFetch = async () => {
  const url = 'https://economia.awesomeapi.com.br/json/all';

  try {
    const request = await fetch(url);
    const response = await request.json();
    return response;
  } catch (error) {
    return error;
  }
  // const request = await fetch(url);
  // const response = await request.json();
  // console.log(response);
  // return response;
};

export default awsomeApiFetch;
