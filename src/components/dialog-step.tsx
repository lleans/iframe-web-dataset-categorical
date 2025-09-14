import { lazy, Suspense, useEffect, useState } from "react";
import { Spinner } from "./ui/shadcn-io/spinner";

const AddCategoriesModal = lazy(() =>
  import("./add-categories-modal").then((module) => ({
    default: module.AddCategoriesModal,
  }))
);
const MainPage = lazy(() =>
  import("./main-page").then((module) => ({
    default: module.MainPage,
  }))
);
const SelectKeysModal = lazy(() =>
  import("./select-keys-modal").then((module) => ({
    default: module.SelectKeysModal,
  }))
);
const UploadFile = lazy(() =>
  import("./upload-file-modal").then((module) => ({
    default: module.UploadFile,
  }))
);

export const DialogStep = () => {
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("dialogStep");
    return savedStep ? Number(savedStep) : 0;
  });

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dialogStep", String(step));
  }, [step]);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      {(() => {
        switch (step) {
          case 0:
            return <UploadFile nextStep={nextStep} />;
          case 1:
            return <SelectKeysModal onNext={nextStep} prevStep={prevStep} />;
          case 2:
            return <AddCategoriesModal onNext={nextStep} prevStep={prevStep} />;
          default:
            return <MainPage />;
        }
      })()}
    </Suspense>
  );
};
