export async function fetchBlob(url) {
    try {
      // Tải file từ URL và chuyển sang Blob
      const response = await fetch(url);
      
      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      // Trả về Blob của file đã tải
      return await response.blob();
    } catch (error) {
      console.error('Error fetching Blob:', error);
      throw error;
    }
  }