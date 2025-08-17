import { apiFetch } from "./apiClient";

export interface BusinessCardUploadResponse {
  image_url: string;
  filename: string;
  file_size: number;
  content_type: string;
}

// 名刺画像をアップロード
export async function uploadBusinessCard(
  imageFile: File
): Promise<BusinessCardUploadResponse> {
  console.log("=== uploadBusinessCard 開始 ===");
  console.log("画像ファイル:", imageFile);
  
  const formData = new FormData();
  formData.append("image", imageFile);
  
  console.log("FormData作成完了");
  console.log("FormData内容:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  console.log("apiFetch呼び出し開始");
  
  try {
    const result = await apiFetch<BusinessCardUploadResponse>("/api/business-cards/upload", {
      method: "POST",
      body: formData,
    });
    
    console.log("apiFetch成功:", result);
    return result;
  } catch (error) {
    console.error("apiFetchエラー:", error);
    throw error;
  }
}
