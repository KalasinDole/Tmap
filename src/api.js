const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

export const getResources = async () => {
  const response = await fetch(`${API_URL}?action=getSheetData`);
  const result = await response.json();
  if (result.status === 'success') {
    return result.data;
  }
  throw new Error(result.message);
};

export const addSheetData = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'addSheetData', data })
  });
  const result = await response.json();
  if (result.status === 'success') {
    return result.success;
  }
  throw new Error(result.message);
};

export const deleteResource = async (id) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'deleteResource', id })
  });
  const result = await response.json();
  if (result.status === 'success') {
    return result.success;
  }
  throw new Error(result.message);
};

export const uploadImageToDrive = async (base64Data, fileName) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'uploadImageToDrive', base64Data, fileName })
  });
  const result = await response.json();
  if (result.status === 'success') {
    return result.url;
  }
  throw new Error(result.message);
};

export const migrateExistingImages = async () => {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'migrateExistingImages' })
  });
  const result = await response.json();
  if (result.status === 'success') {
    return result.success;
  }
  throw new Error(result.message);
};
