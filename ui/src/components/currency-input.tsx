import { useEffect, useState } from "react";
import { Input, InputProps } from "./ui/input";

interface CurrencyInputProps extends InputProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addonBefore?: string;
}
const DECIMAL_SIZE = 2;

const toNumber = (value: string) => Number(value) as unknown as string;

export const CurrencyInput = ({
  value,
  onChange,
  addonBefore = "R$",

  ...props
}: CurrencyInputProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value.toString());

  useEffect(() => {
    const valueString = value.toString();

    if (!/\D/.test(valueString.replace(".", ""))) {
      setCurrentValue(
        addonBefore +
          " " +
          value.toFixed(DECIMAL_SIZE).toString().replace(".", ","),
      );
    }
  }, [value]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // remove mask characters example: R$ 1000,00 -> 1000
    const valueRemoved = event.target.value
      .replace(`${addonBefore} `, "")
      .replace(",", "");

    const sizeSlice = valueRemoved.length - DECIMAL_SIZE;
    const newValue = [
      valueRemoved.slice(0, sizeSlice),
      ".",
      valueRemoved.slice(sizeSlice),
    ].join("");

    onChange({
      ...event,
      target: {
        ...event.target,
        value: toNumber(newValue),
      },
    });
  };

  return <Input onChange={handleOnChange} value={currentValue} {...props} />;
};
