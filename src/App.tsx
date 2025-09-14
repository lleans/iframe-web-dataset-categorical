import { Toaster } from "sonner";
import { DialogStep } from "./components/dialog-step";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <ModeToggle />
      <DialogStep />
    </>
  );
}

export default App;
