import { Button } from "primereact/button";
import {
  InputNumber,
  type InputNumberChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState, type ChangeEventHandler } from "react";
import { clsx } from "clsx";

const ARRAY_MIN_LENGTH = 3;
const DEFAULT_DIGITS = 2;

interface Errors {
  array: string[];
  percent: string[];
  digits: string[];
}

const App = () => {
  const links = [
    {
      label: "WIKIPEDIA: Truncated mean",
      href: "https://en.wikipedia.org/wiki/Truncated_mean",
    },
    {
      label: "Microsoft Excel: TRIMMEAN function",
      href: "https://support.microsoft.com/en-us/office/trimmean-function-d90c9878-a119-4746-88fa-63d988f511d3",
    },
  ];
  const handleClickLink = (link: (typeof links)[number]) => () => {
    window.open(link.href, "_blank");
  };

  const [arrayInput, setArrayInput] = useState("");
  const handleArrayChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setArrayInput(e.target.value);
  };
  const [arrayInputInvalid, setArrayInputInvalid] = useState(false);
  const array = arrayInput
    .split(/[，,\s]/)
    .filter(Boolean)
    .map((part) => Number.parseFloat(part));

  const [percent, setPercent] = useState<number | null>(null);
  const handlePercentChange = (e: InputNumberChangeEvent) => {
    setPercent(e.value);
  };
  const [percentInvalid, setPercentInvalid] = useState(false);
  // Hack fix.
  const percentInvalidClass = clsx(
    "w-full",
    percentInvalid && "!border-red-500"
  );

  const [digits, setDigits] = useState<number | null>(DEFAULT_DIGITS);
  const handleDigitsChange = (e: InputNumberChangeEvent) => {
    setDigits(e.value);
  };
  const [digitsInvalid, setDigitsInvalid] = useState(false);
  // Hack fix.
  const digitsInvalidClass = clsx("w-full", digitsInvalid && "!border-red-500");

  const [result, setResult] = useState("");
  const handleResetResult = () => {
    setResult("");
  };

  const [errors, setErrors] = useState<Errors>({
    array: [],
    percent: [],
    digits: [],
  });
  const handleResetErrors = () => {
    setErrors({
      array: [],
      percent: [],
      digits: [],
    });
  };

  const handleValidate = () => {
    const errors: Errors = {
      array: [],
      percent: [],
      digits: [],
    };

    if (array.length < ARRAY_MIN_LENGTH) {
      errors.array.push(`At least ${ARRAY_MIN_LENGTH} numbers are required`);
      setArrayInputInvalid(true);
    }
    if (array.some((el) => Number.isNaN(el))) {
      errors.array.push("Array must contain only numbers");
      setArrayInputInvalid(true);
    }
    setArrayInputInvalid(errors.array.length > 0);

    if (percent == null) {
      errors.percent.push("Percent is required");
    }
    setPercentInvalid(errors.percent.length > 0);

    if (digits == null) {
      errors.digits.push("Digits is required");
    }
    setDigitsInvalid(errors.digits.length > 0);

    setErrors(errors);

    return (
      errors.array.length === 0 &&
      errors.percent.length === 0 &&
      errors.digits.length === 0
    );
  };

  const handleClick = () => {
    handleResetResult();
    handleResetErrors();

    const isValid = handleValidate();
    if (!isValid) return;

    const _digits = digits ?? DEFAULT_DIGITS;
    const sliceLength = Math.floor((array.length * (percent ?? 100)) / 100 / 2);
    const slicedArray = array
      .toSorted((a, b) => a - b)
      .slice(sliceLength, -sliceLength);

    if (slicedArray.length === 0) {
      setResult(
        `The result is ${["0", "0".repeat(_digits)].join(
          "."
        )} (rounded to ${_digits} decimal places).`
      );
      return;
    }

    const calculatedResult =
      slicedArray.reduce((acc, cur) => acc + cur) / slicedArray.length;
    setResult(
      `The result is ${calculatedResult.toFixed(
        _digits
      )} (rounded to ${_digits} decimal places).`
    );
  };

  return (
    <div className="mx-auto sm:px-6 lg:px-8 max-w-7xl p-20">
      <header className="text-center">
        <h1 className="text-3xl font-medium">Trimmean Now 🏃</h1>
        <div className="flex gap-2 justify-center">
          {links.map((link) => (
            <Button key={link.href} link onClick={handleClickLink(link)}>
              {link.label}
            </Button>
          ))}
        </div>
      </header>

      <main className="mt-12 max-w-[512px] mx-auto w-4/5 flex flex-col gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
        <div>
          <label htmlFor="arrayInput">Array</label>
          <InputText
            value={arrayInput}
            id="arrayInput"
            placeholder={`At least ${ARRAY_MIN_LENGTH} numbers, with comma separated`}
            invalid={arrayInputInvalid}
            onChange={handleArrayChange}
          />
          {errors.array.map((error) => (
            <Message
              key={error}
              severity="error"
              text={error}
              className="w-full !justify-start"
            />
          ))}
        </div>

        <div>
          <label htmlFor="percentInput">Percent</label>
          <InputNumber
            value={percent}
            id="percentInput"
            placeholder="0 ~ 100 without input % manually"
            suffix="%"
            minFractionDigits={0}
            min={0}
            max={100}
            inputClassName={percentInvalidClass}
            invalid={percentInvalid}
            onChange={handlePercentChange}
          />
          {errors.percent.map((error) => (
            <Message
              key={error}
              severity="error"
              text={error}
              className="w-full !justify-start"
            />
          ))}
        </div>

        <div>
          <label htmlFor="digitsInput">Digits</label>
          <InputNumber
            value={digits}
            id="digitsInput"
            placeholder="0 ~ 8"
            minFractionDigits={0}
            min={0}
            max={8}
            inputClassName={digitsInvalidClass}
            invalid={digitsInvalid}
            onChange={handleDigitsChange}
          />
          {errors.digits.map((error) => (
            <Message
              key={error}
              severity="error"
              text={error}
              className="w-full !justify-start"
            />
          ))}
        </div>

        <div className="p-inputgroup w-full">
          <Button label="GO" onClick={handleClick} />
          {result && (
            <Message
              severity="info"
              text={result}
              className="mt-2 w-full justify-start"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
