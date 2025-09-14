import { readFileFromLocalStorage, saveFileToLocalStorage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./animate-ui/radix/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TypographyCodeBlock } from "./ui/typography/code-block";
import { TypographyInlineCode } from "./ui/typography/inline-code";
import { TypographyLarge } from "./ui/typography/large";
import { TypographySmall } from "./ui/typography/small";

export const UploadFile = ({ nextStep }: { nextStep: () => void }) => {
  const [open, setOpen] = useState(true);
  const [currentFile, setFile] = useState<File | undefined>(undefined);
  const [sample, setSample] = useState<Record<string, unknown>[] | undefined>(
    undefined
  );

  useEffect(() => {
    const storedFile = readFileFromLocalStorage();
    if (storedFile) {
      setFile(storedFile);
      takeSample3ObjectFromFile(storedFile);
    }
  }, []);

  const takeSample3ObjectFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const contents = event.target?.result;
      if (contents) {
        const json = JSON.parse(contents as string);
        setSample(json.slice(0, 3));
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast.error("Please upload a valid JSON file.");
        return;
      }

      takeSample3ObjectFromFile(file);
      setFile(file);
    }
  };

  const handleUserIsOkay = () => {
    if (!currentFile && open) {
      toast.error("You need to select a file!");
      return;
    }

    saveFileToLocalStorage(currentFile!);
    setOpen(false);
    nextStep();
  };

  return (
    <Dialog open={open} modal={false}>
      <DialogContent from="top" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Upload your dataset</DialogTitle>
          <DialogDescription>
            Before proceeding to use this app, upload your file here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 w-full">
          <div className="grid w-full items-center gap-3 border-b pb-4">
            <Label htmlFor="file">Dataset File</Label>
            <Input
              id="file"
              onChange={handleFileChange}
              required
              type="file"
              accept=".json"
            />
          </div>
          {sample && (
            <div className="grid w-full items-center gap-3">
              <div className="flex gap-3">
                <TypographyLarge>File Preview</TypographyLarge>
                <TypographyInlineCode>{currentFile?.name}</TypographyInlineCode>
              </div>
              <TypographyCodeBlock className="max-h-60">
                {JSON.stringify(sample, null, 2)}
              </TypographyCodeBlock>
              <TypographySmall>*Showing 3 sample of dataset</TypographySmall>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-end">
          <Button onClick={handleUserIsOkay}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
