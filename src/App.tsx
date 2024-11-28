import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";

const App = () => {
  const [input, setInput] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const numbers = input
    .split(",")
    .flatMap((part) => part.split("，"))
    .map((part) => Number.parseFloat(part.trim()));

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleValidate = () => {
    if (numbers.length < 5) {
      setError("At least 5 numbers are required");
      return false;
    }
    if (numbers.some((n) => Number.isNaN(n))) {
      setError("All inputs must be numbers");
      return false;
    }
    setError("");
    return true;
  };

  const handleClick = () => {
    const isValid = handleValidate();
    if (!isValid) return;
    const filteredNumbers = numbers.toSorted((a, b) => a - b).slice(1, -1);
    const calculatedResult =
      filteredNumbers.reduce((acc, cur) => acc + cur) / filteredNumbers.length;
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
      <main className="mt-12 max-w-[512px] mx-auto w-4/5 text-center">
        <div className="p-inputgroup w-full">
          <InputText
            placeholder="Enter at least 5 numbers with comma separated"
            className="flex-auto rounded-r-none"
            onChange={handleInputChange}
          />
          <Button
            label="GO"
            className="flex-none rounded-l-none"
            onClick={handleClick}
          />
        </div>
        {error && (
          <Message severity="error" text={error} className="mt-2 w-full" />
        )}
        {result && (
          <Message severity="info" text={result} className="mt-2 w-full" />
        )}
      </main>
    </div>
  );
};

export default App;
