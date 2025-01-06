import { Message } from "@/components/message";
import { useState, type ChangeEventHandler } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const ARRAY_MIN_LENGTH = 3;
const DEFAULT_DIGITS = 2;

interface Errors {
  array: string[];
  percent: string[];
  digits: string[];
}

const getInputClassName = (invalid: boolean) =>
  twMerge(
    clsx(
      "w-full border border-gray-300 focus:ring-2 ring-blue-300 px-4 py-2 outline-none rounded transition-all",
      invalid && "border-red-300"
    )
  );

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

  const [arrayInput, setArrayInput] = useState<string>("");
  const onArrayInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setArrayInput(e.target.value);
  };
  const array = arrayInput
    .split(/[，,\s]/)
    .filter(Boolean)
    .map((part) => Number.parseFloat(part));
  const [arrayInvalid, setArrayInvalid] = useState(false);

  const [percentInput, setPercentInput] = useState<string>("");
  const onPercentInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPercentInput(e.target.value);
  };
  const percent = percentInput ? Number.parseFloat(percentInput) : null;
  const [percentInvalid, setPercentInvalid] = useState(false);

  const [digitsInput, setDigitsInput] = useState<string>(
    DEFAULT_DIGITS.toString()
  );
  const onDigitsInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setDigitsInput(e.target.value);
  };
  const digits = digitsInput ? Number.parseFloat(digitsInput) : null;
  const [digitsInvalid, setDigitsInvalid] = useState(false);

  const [result, setResult] = useState("");
  const doResetResult = () => {
    setResult("");
  };

  const [errors, setErrors] = useState<Errors>({
    array: [],
    percent: [],
    digits: [],
  });
  const doResetErrors = () => {
    setErrors({
      array: [],
      percent: [],
      digits: [],
    });
  };

  const doValidate = () => {
    const errors: Errors = {
      array: [],
      percent: [],
      digits: [],
    };

    if (array.length < ARRAY_MIN_LENGTH) {
      errors.array.push(`At least ${ARRAY_MIN_LENGTH} numbers are required`);
      setArrayInvalid(true);
    }
    if (array.some((el) => Number.isNaN(el))) {
      errors.array.push("Array must contain only numbers");
      setArrayInvalid(true);
    }
    setArrayInvalid(errors.array.length > 0);

    if (percent == null) {
      errors.percent.push("Percent is required");
    }
    if (
      percent != null &&
      (Number.isNaN(percent) || percent < 0 || percent > 100)
    ) {
      errors.percent.push("Percent must be between 0 and 100");
    }
    setPercentInvalid(errors.percent.length > 0);

    if (digits == null) {
      errors.digits.push("Digits is required");
    }
    if (digits != null && (Number.isNaN(digits) || digits < 0 || digits > 8)) {
      errors.digits.push("Digits must be between 0 and 8");
    }
    setDigitsInvalid(errors.digits.length > 0);

    setErrors(errors);

    return (
      errors.array.length === 0 &&
      errors.percent.length === 0 &&
      errors.digits.length === 0
    );
  };

  const onSubmit = () => {
    doResetResult();
    doResetErrors();

    const isValid = doValidate();
    if (!isValid) return;

    if (digits == null || percent == null) return;

    const sliceLength = Math.floor((array.length * percent) / 100 / 2);
    const slicedArray = array
      .toSorted((a, b) => a - b)
      .slice(sliceLength, -sliceLength);

    if (slicedArray.length === 0) {
      setResult(
        `The result is ${["0", "0".repeat(digits)].join(
          "."
        )}. Sliced array is empty. Rounded to ${digits} decimal places.`
      );
      return;
    }

    const calculatedResult =
      slicedArray.reduce((acc, cur) => acc + cur) / slicedArray.length;
    setResult(
      `The result is ${calculatedResult.toFixed(
        digits
      )}. Sliced array is ${slicedArray.join(
        ", "
      )}. Rounded to ${digits} decimal places.`
    );
  };

  return (
    <div className="mx-auto sm:px-6 lg:px-8 max-w-7xl p-20">
      <header className="text-center">
        <h1 className="text-3xl font-medium">Trimmean Now 🏃</h1>
        <div className="mt-2 flex gap-2 justify-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button
                type="button"
                className="text-underline text-blue-500 hover:bg-gray-100 active:bg-gray-200 rounded px-4 py-2 transition-all"
              >
                {link.label}
              </button>
            </a>
          ))}
        </div>
      </header>

      <main className="mt-12 max-w-[512px] mx-auto w-4/5 flex flex-col gap-4 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
        <div>
          <label htmlFor="arrayInput">Array</label>
          <input
            id="arrayInput"
            className={getInputClassName(arrayInvalid)}
            placeholder={`At least ${ARRAY_MIN_LENGTH} numbers, with comma separated`}
            value={arrayInput}
            onChange={onArrayInputChange}
          />
          {errors.array.map((error) => (
            <Message key={error} type="error" text={error} />
          ))}
        </div>

        <div>
          <label htmlFor="percentInput">Percent (%)</label>
          <input
            id="percentInput"
            className={getInputClassName(percentInvalid)}
            placeholder="0 ~ 100 without %"
            value={percentInput}
            onChange={onPercentInputChange}
          />
          {errors.percent.map((error) => (
            <Message key={error} type="error" text={error} />
          ))}
        </div>

        <div>
          <label htmlFor="digitsInput">Digits</label>
          <input
            id="digitsInput"
            className={getInputClassName(digitsInvalid)}
            placeholder="0 ~ 8"
            value={digitsInput}
            onChange={onDigitsInputChange}
          />
          {errors.digits.map((error) => (
            <Message key={error} type="error" text={error} />
          ))}
        </div>

        <div className="p-inputgroup w-full">
          <button
            type="button"
            onClick={onSubmit}
            className="bg-blue-500 text-white transition-all rounded py-2 active:bg-blue-600 hover:bg-blue-400"
          >
            GO
          </button>
          {result && <Message type="info" text={result} className="mt-2" />}
        </div>
      </main>
    </div>
  );
};

export default App;
