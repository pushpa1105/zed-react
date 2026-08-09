import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/shared/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { cn } from '@/shared/utils';

export interface CardRadiogroupItemInterface {
  label: string;
  description?: string;
  value: string;
}

interface CardRadiogroupInterface {
  items: CardRadiogroupItemInterface[];
  defaultValue?: string;
  onChange?: (e: _) => void;
  className?: string;
}

export const CardRadioGroup = ({
  items,
  defaultValue,
  onChange,
  className,
}: CardRadiogroupInterface) => {
  return (
    <RadioGroup
      defaultValue={defaultValue}
      className={cn('', className)}
      onValueChange={onChange}
    >
      {items.map((item) => (
        <FieldLabel htmlFor={item.value} key={item.value}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{item.label}</FieldTitle>
              <FieldDescription>{item.description}</FieldDescription>
            </FieldContent>
            <RadioGroupItem value={item.value} id={item.value} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
};
