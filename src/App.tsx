import { Button } from "primereact/button";
import {
  InputNumber,
  type InputNumberChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState, type ChangeEventHandler } from "react";

const ARRAY_MIN_LENGTH = 3;

const App = () => {
  const [arrayInput, setArrayInput] = useState("");
  const handleArrayChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setArrayInput(e.target.value);
  };
  const array = arrayInput
    .split(",")
    .flatMap((part) => part.split("，"))
    .map((part) => Number.parseFloat(part.trim()));

  const [percent, setPercent] = useState<number | null>(null);
  const handlePercentChange = (e: InputNumberChangeEvent) => {
    setPercent(e.value);
  };

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleValidate = () => {
    if (array.length < ARRAY_MIN_LENGTH) {
      setError(`At least ${ARRAY_MIN_LENGTH} numbers are required`);
      return false;
    }
    if (array.some((el) => Number.isNaN(el))) {
      setError("Array must contain only numbers");
      return false;
    }
    if (percent == null) {
      setError("Percent is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleClick = () => {
    const isValid = handleValidate();
    if (!isValid) return;
    const sliceLength = Math.floor((array.length * (percent ?? 100)) / 100 / 2);
    const filteredArray = array
      .toSorted((a, b) => a - b)
      .slice(sliceLength, -sliceLength);
    if (filteredArray.length === 0) {
      setResult("The result is 0.00 (rounded to 2 decimal places).");
      return;
    }
    const calculatedResult =
      filteredArray.reduce((acc, cur) => acc + cur) / filteredArray.length;
    setResult(
      `The result is ${calculatedResult.toFixed(
        2
      )} (rounded to 2 decimal places).`
    );
  };

  return (
    <div className="mx-auto sm:px-6 lg:px-8 max-w-7xl p-20">
      <header className="text-center">
        <h1 className="text-3xl font-medium">Trimmean Now 🏃</h1>
      </header>

      <main className="mt-12 max-w-[512px] mx-auto w-4/5 flex flex-col gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
        <div>
          <label htmlFor="arrayInput">Array</label>
          <InputText
            id="arrayInput"
            placeholder={`At least ${ARRAY_MIN_LENGTH} numbers, with comma separated`}
            onChange={handleArrayChange}
          />
        </div>

        <div>
          <label htmlFor="percentInput">Percent</label>
          <InputNumber
            id="percentInput"
            placeholder="0 ~ 100 without input % manually"
            suffix="%"
            minFractionDigits={0}
            min={0}
            max={100}
            inputClassName="w-full"
            onChange={handlePercentChange}
          />
        </div>

        <div className="p-inputgroup w-full">
          <Button label="GO" onClick={handleClick} />
          {error && (
            <Message severity="error" text={error} className="mt-2 w-full" />
          )}
          {result && (
            <Message severity="info" text={result} className="mt-2 w-full" />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
