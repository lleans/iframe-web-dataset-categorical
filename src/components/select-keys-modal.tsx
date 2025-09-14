import {
  readFileFromLocalStorage,
  readSelectedKey,
  saveSelectedKey,
  type SelectedKeysType,
} from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SelectKeysModal = ({
  onNext,
  prevStep,
}: {
  onNext: () => void;
  prevStep: () => void;
}) => {
  const [open, setOpen] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState<SelectedKeysType>({
    title: "",
    description: "",
    extra: "",
    iframe: "",
  });
  const [currentFile, setCurrentFile] = useState<Record<
    string,
    string | number | boolean
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fileLocal: File | null = readFileFromLocalStorage();
    const selectedKeysLocal: SelectedKeysType | null = readSelectedKey();

    if (fileLocal) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const contents = event.target?.result;
        if (contents) {
          const json = JSON.parse(contents as string);
          setCurrentFile(json[0]);
          setIsLoading(false); // Set loading to false after loading
        }
      };
      reader.readAsText(fileLocal);
    } else {
      setIsLoading(false); // If no file, stop loading
    }

    if (selectedKeysLocal) {
      setSelectedKeys(selectedKeysLocal);
    }
  }, [setCurrentFile, setSelectedKeys]);

  const listOfKeysOnFile = useMemo(() => {
    const keys = currentFile
      ? Object.keys(currentFile).filter(
          (key) =>
            currentFile &&
            currentFile[key] !== null &&
            (typeof currentFile[key] === "string" ||
              typeof currentFile[key] === "number" ||
              typeof currentFile[key] === "boolean")
        )
      : [];

    const filterUrlKeys = keys.filter(
      (key) =>
        currentFile![key]?.toString().includes("http") ||
        currentFile![key]?.toString().includes("https")
    );
    const filterNonUrlKeys = keys.filter(
      (key) =>
        !currentFile![key]?.toString().includes("http") ||
        !currentFile![key]?.toString().includes("https")
    );

    return (
      <>
        <SelectGroup>
          <SelectLabel>URL Keys</SelectLabel>
          {filterUrlKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Other Keys</SelectLabel>
          {filterNonUrlKeys.map((key) => (
            <SelectItem key={key} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectGroup>
      </>
    );
  }, [currentFile]);

  const handleUserIsOkay = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(selectedKeys).some((key) => key === "")) {
      toast.error("You need to select all keys!");
      return;
    }

    if (!currentFile && open) {
      toast.error("You need to select a file!");
      return;
    }

    // use the controlled state instead of FormData
    saveSelectedKey(selectedKeys);
    setOpen(false);
    onNext();
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
          <DialogTitle>Select keys on dataset</DialogTitle>
          <DialogDescription>
            Select keys to show in the page.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUserIsOkay} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 w-full">
            <div className="grid flex-col gap-3">
              <Label>Select title keys</Label>
              <Select
                name="title"
                value={selectedKeys.title}
                required
                disabled={isLoading} // Disable while loading
                onValueChange={(v) =>
                  setSelectedKeys((s) => ({ ...s, title: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select a key"}
                  />
                </SelectTrigger>
                <SelectContent>{listOfKeysOnFile}</SelectContent>
              </Select>
            </div>
            <div className="grid flex-col gap-3">
              <Label>Select description keys</Label>
              <Select
                name="description"
                value={selectedKeys.description}
                required
                disabled={isLoading} // Disable while loading
                onValueChange={(v) =>
                  setSelectedKeys((s) => ({ ...s, description: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select a key"}
                  />
                </SelectTrigger>
                <SelectContent>{listOfKeysOnFile}</SelectContent>
              </Select>
            </div>
            <div className="grid flex-col gap-3">
              <Label>Select extra keys</Label>
              <Select
                name="extra"
                value={selectedKeys.extra}
                required
                disabled={isLoading} // Disable while loading
                onValueChange={(v) =>
                  setSelectedKeys((s) => ({ ...s, extra: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select a key"}
                  />
                </SelectTrigger>
                <SelectContent>{listOfKeysOnFile}</SelectContent>
              </Select>
            </div>
            <div className="grid flex-col gap-3">
              <Label>Select url keys for I-Frame</Label>
              <Select
                name="iframe"
                value={selectedKeys.iframe}
                required
                disabled={isLoading} // Disable while loading
                onValueChange={(v) =>
                  setSelectedKeys((s) => ({ ...s, iframe: v }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={isLoading ? "Loading..." : "Select a key"}
                  />
                </SelectTrigger>
                <SelectContent>{listOfKeysOnFile}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
