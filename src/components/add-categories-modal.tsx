import { readCategoryNames, saveCategoryNames } from "@/lib/utils";
import { MoveLeft, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./animate-ui/radix/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./animate-ui/radix/tooltip";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const AddCategoriesModal = ({
  onNext,
  prevStep,
}: {
  onNext: () => void;
  prevStep: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const [categoryName, setCategoryName] = useState<string[]>([]);

  useEffect(() => {
    const categories = readCategoryNames();
    if (categories) {
      setCategoryName(categories);
    }
  }, []);

  const handleUserConfirm = () => {
    saveCategoryNames(categoryName);

    setOpen(false);
    onNext();
  };

  const handleUserClickEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = (e.currentTarget as HTMLInputElement).value.trim();
    if (!val || categoryName.includes(val)) return; // Prevent duplicates
    setCategoryName((prev) => [...(prev || []), val]);
    (e.currentTarget as HTMLInputElement).value = "";
  };

  return (
    <Dialog open={open} modal={false}>
      <DialogContent from="right" showCloseButton={false}>
        <DialogHeader>
          <Tooltip>
            <TooltipTrigger asChild>
              <MoveLeft onClick={prevStep} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back to previous step</p>
            </TooltipContent>
          </Tooltip>
          <DialogTitle>Add categories</DialogTitle>
          <DialogDescription>
            Add categories taht you'llbe working on.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              name="category-name"
              onKeyDown={handleUserClickEnter}
            />
          </div>
          <div className="flex flex-wrap max-w-full gap-3">
            {categoryName?.map((it) => (
              <Badge
                key={it}
                className="text-md font-medium items-center flex-shrink-0"
              >
                {it}
                <Button
                  onClick={() =>
                    setCategoryName((prev) => prev.filter((cat) => cat !== it))
                  }
                  variant="outline"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleUserConfirm}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
