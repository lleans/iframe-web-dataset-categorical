import {
  clearAllLocalStorage,
  readCategorizedData,
  readCategoryNames,
  readFileFromLocalStorage,
  readReviewIndex,
  readSelectedKey,
  saveCategorizedData,
  saveCategoryNames,
  saveFileToLocalStorage,
  saveReviewIndex,
  type CategorizedMap,
} from "@/lib/utils";
import { Trash2 } from "lucide-react"; // Import trash icon
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";

const isUrl = (v: unknown) =>
  typeof v === "string" && (v.includes("http://") || v.includes("https://"));

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const DetailCard = ({
  item,
  selectedKeys,
  categories,
  categorized,
  onCategorize,
  onRemoveFromCategory,
  onPrev,
  onNext,
  index,
  total,
  onDownloadCategorized,
  onUpdateField,
  onAddCategory,
}: {
  item: Record<string, unknown>;
  selectedKeys: {
    title: string;
    description: string;
    extra: string;
    iframe: string;
  } | null;
  categories: string[];
  categorized: CategorizedMap;
  onCategorize: (category: string) => void;
  onRemoveFromCategory: (category: string) => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
  onDownloadCategorized: () => void;
  onUpdateField: (key: string, value: string) => void;
  onAddCategory: (newCategory: string) => void;
}) => {
  const [newCategory, setNewCategory] = useState("");

  // Compute which categories already contain the current item based on _id
  const currentId = String(item._id || "");
  const itemCategories = categories.filter((category) =>
    categorized[category]?.some(
      (catItem: Record<string, unknown>) => String(catItem._id) === currentId
    )
  );

  const handleAdd = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const titleKey = selectedKeys?.title || "";
  const descKey = selectedKeys?.description || "";
  const extraKey = selectedKeys?.extra || "";

  const renderValueInput = (k: string, v: unknown) => {
    const str = v == null ? "" : String(v);
    const useTextarea = str.includes("\n") || str.length > 120;

    // Make _id read-only
    if (k === "_id") {
      return <span className="break-all">{str}</span>;
    }

    // Make the selected iframe key read-only (non-editable)
    if (k === selectedKeys?.iframe) {
      return <span className="break-all">{str}</span>;
    }

    if (isUrl(v)) {
      return (
        <Input
          type="url"
          value={str}
          onChange={(e) => onUpdateField(k, e.target.value)}
          className="w-full"
        />
      );
    }

    if (useTextarea) {
      return (
        <Textarea
          value={str}
          onChange={(e) => onUpdateField(k, e.target.value)}
          rows={4}
          className="w-full resize-none"
        />
      );
    }

    return (
      <Input
        type="text"
        value={str}
        onChange={(e) => onUpdateField(k, e.target.value)}
        className="w-full"
      />
    );
  };

  return (
    <Card className="absolute right-4 bottom-4 w-96 max-h-[80vh] z-20 shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle>
          {titleKey && item[titleKey] ? (
            isUrl(item[titleKey]) ? (
              <a
                href={String(item[titleKey])}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary break-words"
              >
                {String(item[titleKey])}
              </a>
            ) : (
              String(item[titleKey])
            )
          ) : (
            "No title"
          )}
        </CardTitle>
        <CardDescription>
          {descKey && item[descKey] ? (
            isUrl(item[descKey]) ? (
              <a
                href={item[descKey] as string}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary break-words"
              >
                {String(item[descKey]).length > 100 ? (
                  <span title={String(item[descKey])}>
                    {String(item[descKey]).slice(0, 100)}...
                  </span>
                ) : (
                  String(item[descKey])
                )}
              </a>
            ) : String(item[descKey]).length > 100 ? (
              <span title={String(item[descKey])}>
                {String(item[descKey]).slice(0, 100)}...
              </span>
            ) : (
              String(item[descKey])
            )
          ) : (
            "No description"
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col w-full gap-3 flex-grow">
        <div>
          <strong>Extra:</strong>{" "}
          {extraKey && item[extraKey] ? (
            isUrl(item[extraKey]) ? (
              <a
                href={String(item[extraKey])}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-primary break-words"
              >
                {String(item[extraKey])}
              </a>
            ) : (
              String(item[extraKey])
            )
          ) : (
            "—"
          )}
        </div>

        <div className="flex flex-col">
          <strong>All fields (editable):</strong>
          <div className="mt-2 max-h-48 overflow-auto overflow-x-hidden">
            <Table className="w-full table-fixed">
              <TableBody>
                {Object.entries(item).map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell className="font-medium w-1/4 py-2 align-top truncate">
                      {k}
                    </TableCell>
                    <TableCell className="w-2/3 py-2">
                      {renderValueInput(k, v)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-center w-full gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={onPrev} variant="outline" size="sm">
              Prev
            </Button>
            <Button onClick={onNext} variant="outline" size="sm">
              Next
            </Button>
            <span className="text-sm text-muted-foreground ml-2">
              {index + 1} / {total}
            </span>
          </div>
          <div className="flex gap-2">
            <Button onClick={onDownloadCategorized} variant="default" size="sm">
              Download Categorized
            </Button>
          </div>
          {total === index + 1 && (
            <Button onClick={clearAllLocalStorage} variant="outline" size="sm">
              Clear All
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length ? (
            categories.map((c) => {
              const isIncluded = itemCategories.includes(c);
              return (
                <div key={c} className="flex flex-col">
                  <Button
                    onClick={() =>
                      isIncluded ? onRemoveFromCategory(c) : onCategorize(c)
                    }
                    size="sm"
                    variant={isIncluded ? "destructive" : "secondary"}
                    className="flex items-center gap-2"
                  >
                    {c}
                    {isIncluded && <Trash2 />}
                  </Button>
                  {isIncluded && (
                    <span className="text-xs text-muted-foreground mt-1">
                      *You need to remove and add first before modifying already
                      added category data.
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <span className="text-sm text-muted-foreground">
              No categories saved
            </span>
          )}
        </div>

        <div className="flex gap-2 w-full">
          <Input
            placeholder="New category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleAdd} size="sm">
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const MainPage = () => {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<null | {
    title: string;
    description: string;
    extra: string;
    iframe: string;
  }>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorized, setCategorized] = useState<CategorizedMap>({}); // Manage categorized data in state for reactivity
  const [index, setIndex] = useState<number>(() => readReviewIndex());

  const debouncedData = useDebounce(data, 10000);
  const debouncedCategorized = useDebounce(categorized, 1000);

  useEffect(() => {
    const f = readFileFromLocalStorage();
    if (!f) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || "[]"));
        if (Array.isArray(parsed)) {
          // Do not assign _id here; will be handled later based on selectedKeys
          setData(parsed);
        }
      } catch (error) {
        console.error("Failed to parse dataset:", error);
        setData([]);
      }
    };
    reader.readAsText(f);
  }, []);

  // New effect to assign _id based on the selected iframe key value
  useEffect(() => {
    if (data.length > 0 && selectedKeys?.iframe) {
      setData((prev) =>
        prev.map((item, idx) => {
          if (!item._id) {
            const urlValue = String(item[selectedKeys.iframe] || "");
            // Use the URL value as _id, fallback to index-based if empty
            return { ...item, _id: urlValue || `item_${idx}` };
          }
          return item;
        })
      );
    }
  }, [data.length, selectedKeys?.iframe]); // Runs when data is loaded and selectedKeys is set

  useEffect(() => {
    const sk = readSelectedKey();
    if (sk) setSelectedKeys(sk);
    const cats = readCategoryNames();
    if (cats) setCategories(cats);
    const catData = readCategorizedData();
    if (catData) setCategorized(catData);
  }, []);

  useEffect(() => {
    saveReviewIndex(index);
  }, [index]);

  useEffect(() => {
    if (debouncedData.length) {
      const json = JSON.stringify(debouncedData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const file = new File([blob], "dataset.json", {
        type: "application/json",
      });
      saveFileToLocalStorage(file);
      toast("Dataset Auto-Saved", {
        description:
          "Your changes to the dataset have been automatically saved.",
      });
    }
  }, [debouncedData]);

  useEffect(() => {
    saveCategorizedData(debouncedCategorized);
  }, [debouncedCategorized]);

  const total = data.length;
  const current = useMemo(() => data[index] || {}, [data, index]);

  const handlePrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  const handleCategorize = useCallback(
    (category: string) => {
      if (!Object.keys(current).length) return;

      let wasUpdated = false;

      setCategorized((prev) => {
        const newCategorized = { ...prev };
        let categoryItems = newCategorized[category] || [];

        const itemCopy = { ...current };
        const itemId = String(itemCopy._id);

        if (!itemId) {
          toast("Error", {
            description: "Item missing ID; cannot categorize.",
          });
          return prev; // No change
        }

        const existingIndex = categoryItems.findIndex(
          (it: Record<string, unknown>) => String(it._id) === itemId
        );

        if (existingIndex !== -1) {
          categoryItems[existingIndex] = itemCopy;
          wasUpdated = true;
        } else {
          categoryItems = [...categoryItems, itemCopy];
        }

        newCategorized[category] = categoryItems;
        return newCategorized;
      });

      toast(wasUpdated ? "Item Updated" : "Item Categorized", {
        description: wasUpdated
          ? `Item in category "${category}" has been updated with new data.`
          : `Item added to category "${category}".`,
      });

      if (!wasUpdated) {
        handleNext();
      }
    },
    [current, handleNext]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.altKey && e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.altKey && e.key === "ArrowRight") {
        handleNext();
      } else if (
        e.altKey &&
        !isNaN(Number(e.key)) &&
        Number(e.key) >= 1 &&
        Number(e.key) <= categories.length
      ) {
        // Handle Alt + numeric keys for categorization
        const catIndex = Number(e.key) - 1;
        const category = categories[catIndex];
        handleCategorize(category);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, categories, handleCategorize]); // Add dependencies

  const handleUpdateField = useCallback(
    (key: string, value: string) => {
      setData((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [key]: value };
        return copy;
      });
    },
    [index]
  );

  const handleRemoveFromCategory = useCallback(
    (category: string) => {
      const itemId = String(current._id);

      if (!itemId) {
        toast("Error", {
          description: "Item missing ID; cannot remove.",
        });
        return;
      }

      setCategorized((prev) => {
        const newCategorized = { ...prev };
        const categoryItems = newCategorized[category] || [];

        newCategorized[category] = categoryItems.filter(
          (it: Record<string, unknown>) => String(it._id) !== itemId
        );

        return newCategorized;
      });

      toast("Item Removed", {
        description: `Item removed from category "${category}".`,
      });

      // Do not auto-next on remove to allow multiple removals
    },
    [current]
  );

  const handleAddCategory = (newCat: string) => {
    if (!newCat || categories.includes(newCat)) return;
    const newCats = [...categories, newCat];
    setCategories(newCats);
    saveCategoryNames(newCats);
  };

  const handleDownloadCategorized = () => {
    const blob = new Blob([JSON.stringify(categorized, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categorized.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!total) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        No dataset loaded
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <iframe
        src={String(current[selectedKeys?.iframe ?? ""] || "")}
        title="Main Content"
        className="absolute inset-0 w-full h-full z-0 border-none"
        loading="lazy"
      />
      <DetailCard
        item={current}
        selectedKeys={selectedKeys}
        categories={categories}
        categorized={categorized}
        onCategorize={handleCategorize}
        onRemoveFromCategory={handleRemoveFromCategory}
        onPrev={handlePrev}
        onNext={handleNext}
        index={index}
        total={total}
        onDownloadCategorized={handleDownloadCategorized}
        onUpdateField={handleUpdateField}
        onAddCategory={handleAddCategory}
      />
    </div>
  );
};
