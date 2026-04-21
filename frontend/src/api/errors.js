export function getApiErrorMessage(error) {
  if (!error) {
    return 'Unknown API error';
  }

  if (error.response?.data) {
    const responseData = error.response.data;

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData.message) {
      return responseData.message;
    }

    if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
      return responseData.errors[0];
    }
  }

  if (error.message) {
    return error.message;
  }

  return 'Request failed';
}

export function isNetworkError(error) {
  return error?.code === 'ERR_NETWORK' || !error?.response;
}
