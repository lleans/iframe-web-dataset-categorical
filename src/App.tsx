import { RotateCcw } from "lucide-react";
import { useCallback } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/animate-ui/radix/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/animate-ui/radix/tooltip";
import { DialogStep } from "./components/dialog-step";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { clearAllLocalStorage } from "./lib/utils";

function App() {
  const ModalReset = () => {
    const handleUserIsOkay = useCallback(() => {
      clearAllLocalStorage();
      window.location.reload();
    }, []);

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={"icon"}
            variant="destructive"
            className="absolute top-16 right-4 z-20"
          >
            <RotateCcw />
          </Button>
        </DialogTrigger>
        <DialogContent from="top">
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              By clicking reset, it will reset all state of the app.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button variant="destructive" onClick={handleUserIsOkay}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <ModalReset />
      <ModeToggle />
      <Tooltip>
        <TooltipTrigger asChild>
          <ModalReset />
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset</p>
        </TooltipContent>
      </Tooltip>
      <DialogStep />
    </>
  );
}

export default App;
