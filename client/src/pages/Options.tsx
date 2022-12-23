import SectionTitle from "../components/text/SectionTitle";
import { VscSettings } from "react-icons/vsc";
import { IoHammerOutline } from "react-icons/io5";
import SelectInput from "../components/input/SelectInput";
import GreenButton from "../components/buttons/GreenButton";
import { FC, useCallback, useEffect, useState } from "react";
import LineInput from "../components/input/LineInput";
import { Line } from "../types/line";
import { generateLink } from "../utils/generate";
import { useFetchThemes } from "../hooks/useFetchThemes";
import NumberInput from "../components/input/NumberInput";
import TrueFalseInput from "../components/input/TrueFalseInput";
import Input from "../components/input/Input";
import SecondaryButton from "../components/buttons/SecondaryButton";

interface OptionsProps {
  setLink: (link: string) => void;
}

const Options: FC<OptionsProps> = (props) => {
  const themes = useFetchThemes();
  const [lineChars, setLineChars] = useState(["1"]);

  const [title, setTitle] = useState<string>("My Tech Stack");
  const [lineCount, setLineCount] = useState<string>("1");
  const [theme, setTheme] = useState<string>("github");
  const [align, setAlign] = useState<string>("left");
  const [lines, setLines] = useState<Line[]>([]);
  const [showBorder, setShowBorder] = useState(true);
  const [borderRadius, setBorderRadius] = useState<string>("4.5");
  const [fontWeight, setFontWeight] = useState<string>("semibold");
  const [fontSize, setFontSize] = useState<string>("18");

  useEffect(() => {
    // create an array with the numbers of lineCount to 1
    const res: string[] = [];
    for (let i = 1; i <= Number(lineCount); i++) {
      res.push(`${i}`);
      setLines((prev) => [
        ...prev,
        {
          badges: [],
          lineNumber: `${i}`,
        },
      ]);
    }
    setLineChars(res);
  }, [lineCount, setLineCount, setLines]);

  const reset = () => {
    setTitle("My Tech Stack");
    setLineCount("1");
    setTheme("github");
    setAlign("left");
    setShowBorder(true);
    setLines([]);
    setBorderRadius("4.5");
    setFontSize("18");
    setFontWeight("semibold");
  };

  const updateLine = useCallback(
    (line: Line) => {
      setLines((prev) => {
        const res: Line[] = [];

        for (const l of [...prev]) {
          if (l.lineNumber === line.lineNumber) {
            res.push(line);
            continue;
          }

          res.push(l);
        }

        return res;
      });
    },
    [setLines]
  );

  const validateBorderRadius = (val: string): string => {
    const num = parseInt(val);

    if (val.trim() === "") {
      return "Please provide a border radius!";
    }

    if (!val.split("").every((x) => "0123456789.".includes(x))) {
      return "Please provide a valid number!";
    }

    if (num > 50 || num < 0) {
      return "Please provide a value between 0 and 50";
    }

    return "";
  };

  return (
    <section
      className="border border-solid border-gh-border rounded-md 
        w-full lg:w-[45%]"
    >
      <SectionTitle icon={VscSettings} title="Options" />

      <div className="m-4 flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="My Tech Stack"
          value={title}
          setValue={(val) => setTitle(val)}
          validate={() => ""}
        />

        <div className="flex items-center gap-4">
          <SelectInput
            label="Theme"
            options={themes}
            value={theme}
            setValue={setTheme}
            searchField={true}
          />

          <SelectInput
            label="Badge Align"
            options={["left", "center", "right"]}
            value={align}
            setValue={(val) => setAlign(val)}
          />
        </div>

        <div className="flex items-start gap-4">
          <SelectInput
            label="Font Weight"
            options={["thin", "normal", "semibold", "bold"]}
            value={fontWeight}
            setValue={(val) => setFontWeight(val)}
          />

          <NumberInput
            label="Font Size"
            value={fontSize}
            setValue={(val) => setFontSize(val)}
            minValue={15}
            maxValue={30}
          />
        </div>

        <Input
          label="Border Radius"
          placeholder="4.5"
          value={borderRadius}
          setValue={(val) => setBorderRadius(val)}
          helperText="A number between 0 and 50."
          validate={(val) => validateBorderRadius(val)}
        />

        <div className="flex items-start gap-4">
          <TrueFalseInput
            label="Border"
            setValue={(val) => setShowBorder(val)}
            value={showBorder}
          />

          <NumberInput
            label="Lines"
            value={lineCount}
            setValue={(val) => setLineCount(val)}
            minValue={1}
            maxValue={5}
          />
        </div>
      </div>

      <div className="my-4 flex flex-col gap-4 px-4">
        <div className="w-full h-[.8px] bg-gh-border mx-auto" />

        {lineChars.map((line) => (
          <LineInput line={line} updateLine={updateLine} key={line} />
        ))}

        <div className="w-full h-[.8px] bg-gh-border mx-auto" />

        <div className="flex items-stretch gap-3">
          <GreenButton
            icon={IoHammerOutline}
            onClick={() => {
              props.setLink(
                generateLink(
                  title,
                  lineCount,
                  theme,
                  align,
                  lines,
                  showBorder,
                  borderRadius,
                  fontWeight,
                  fontSize
                )
              );
            }}
            disabled={validateBorderRadius(borderRadius) !== ""}
            text="Generate"
          />

          <SecondaryButton
            onClick={() => reset()}
            text="Reset"
            className="text-red-500 font-semibold"
          />
        </div>
      </div>
    </section>
  );
};

export default Options;