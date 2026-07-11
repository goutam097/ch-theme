import React from 'react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectOptionProps {
  value?: string | { value: string, label: string, disabled?:boolean }[]; // Accept both single and array values
  onChange: (value: string | { value: string, label: string }[]) => void;
  options?: Option[];
  className?: string;
  placeholder?: string;
  isMulti?: boolean;
  isCheckbox?: boolean;
  disabled?: boolean;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  placeholder,
  isMulti = false,
  isCheckbox = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMulti) {
      const selectedOptions = Array.from(e.target.selectedOptions)
        .map(option => ({
          value: option.value,
          label: option.label
        }));
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };
  const selectedCheckboxValues = Array.isArray(value)
    ? value.map(v => v.value)
    : [];

  const handleCheckboxChange = (option: Option, isChecked: boolean) => {
    const currentSelections = Array.isArray(value) ? value : [];

    if (isChecked) {
      const alreadySelected = currentSelections.some(item => item.value === option.value);
      if (!alreadySelected) {
        onChange([...currentSelections, { value: option.value, label: option.label }]);
      }
      return;
    }

    onChange(currentSelections.filter(item => item.value !== option.value));
  };

  return (
    <>
    {/* <select */} 
    {isCheckbox ? (
      <div className="search-result position-relative">
        {options?.map((option, index) => {
          const checkboxId = `cb2-${index}`;
          const checkboxClassNames = [
            "custom-checkbox-with-image pb-2 d-flex mb-0 border-0  w-100",
            "custom-checkbox-with-image pb-2 d-flex mb-0 border-0 pt-0 w-100",
            "custom-checkbox-with-image pt-0 pb-2 d-flex border-0 mb-0 w-100"
          ];
          return (
            <div key={option.value} className={index === 2 ? "se_item cDropL " : "se_item cDropL"}>
              <div className={checkboxClassNames[index % checkboxClassNames.length]}>
                {/* <input type="checkbox" name="cb" id="cb2" /> */}
                <input
                  type="checkbox"
                  name="cb"
                  id={checkboxId}
                  checked={selectedCheckboxValues.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                  disabled={disabled || option.disabled}
                />
                <label
                  className="custom-checkbox d-flex align-items-center"
                  htmlFor={checkboxId}
                >
                  {/* <span className="d-block font-12">jkjkjk</span> */}
                  <div>
                    <span className="d-block font-12">{option.label}</span>
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
    <select
      multiple={isMulti}
      value={isMulti
        ? (value as { value: string }[]).map(v => v.value)
        : value as string
      }
      onChange={handleChange}
      className={className}
      disabled={disabled} 
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options?.map(option => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
    )}
    </>
  );
};
export default SelectOption;
