import { RotateCcw } from "lucide-react";
import { Toaster } from "sonner";
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
  return (
    <>
      <Toaster position="top-right" />
      <ModeToggle />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={"icon"}
            variant="destructive"
            className="absolute top-16 right-4 z-20"
            onClick={() => {
              clearAllLocalStorage();
              window.location.reload();
            }}
          >
            <RotateCcw />
          </Button>
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
