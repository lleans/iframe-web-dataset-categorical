import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const FILE_KEY_NAME = "dataset_file_key_name";

export type SelectedKeysType = {
  title: string;
  description: string;
  extra: string;
  iframe: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saveFileToLocalStorage(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string;
    localStorage.setItem(FILE_KEY_NAME, dataUrl);
  };
  reader.readAsDataURL(file);
}

export function readFileFromLocalStorage(): File | null {
  const dataUrl = localStorage.getItem(FILE_KEY_NAME);
  if (dataUrl) {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], "dataset_file", { type: mimeString });
  }
  return null;
}

export function saveSelectedKey(key: SelectedKeysType) {
  localStorage.setItem("selected_key", JSON.stringify(key));
}

export function readSelectedKey(): SelectedKeysType | null {
  const key = localStorage.getItem("selected_key");
  return key ? JSON.parse(key) : null;
}

export function saveCategoryNames(categories: string[]) {
  localStorage.setItem("category_names", JSON.stringify(categories));
}

export function readCategoryNames(): string[] | null {
  const categories = localStorage.getItem("category_names");
  return categories ? JSON.parse(categories) : null;
}

export const REVIEW_INDEX_KEY = "review_index";
export const CATEGORIZED_KEY = "categorized_data";

export function saveReviewIndex(index: number) {
  localStorage.setItem(REVIEW_INDEX_KEY, String(index));
}

export function readReviewIndex(): number {
  const v = localStorage.getItem(REVIEW_INDEX_KEY);
  return v ? Number(v) : 0;
}

export type CategorizedMap = Record<string, Record<string, unknown>[]>;

export function readCategorizedData(): CategorizedMap | null {
  const raw = localStorage.getItem(CATEGORIZED_KEY);
  return raw ? (JSON.parse(raw) as CategorizedMap) : null;
}

// Save the entire categorized data object to local storage
export const saveCategorizedData = (categorizedData: CategorizedMap) => {
  localStorage.setItem(CATEGORIZED_KEY, JSON.stringify(categorizedData));
};

export function clearAllLocalStorage() {
  localStorage.clear();
}
