import { CardRadioGroup } from "@/components/inputs/CardRadioGroup"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { AnyFieldApi } from "@tanstack/react-form"

type InputTypes = "text" | "number" | "password" | "card-radio-group"

interface OptionsType {
    label: string
    value: string
    [key: string]: any
}

interface inputItem {
    key: string
    label?: string
    placeholder?: string
    type?: InputTypes
    render?: (field: any) => React.ReactNode
    className?: string
    items?: OptionsType[]
    configs?: object
}

interface SmartFormPropsInterface {
    formInstance: any,
    inputItems: inputItem[],
    formClassName?: string,
}

interface RenderInputFieldProps {
    type?: InputTypes
    field: any
    item: inputItem
}

const renderInputField = ({ type, field, item }: RenderInputFieldProps) => {
    const commonProps = {
        id: field.name,
        name: field.name,
        value: field.state.value,
        onBlur: field.handleBlur,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            field.handleChange(type === 'number' ? parseFloat(e.target.value) : e.target.value),
        placeholder: item.placeholder || item.label,
        'aria-invalid': field.state.meta.isTouched && !field.state.meta.isValid,
        autoComplete: "off",
        className: item?.className
    }

    switch (type) {
        case "number":
            return <Input {...commonProps} type="number" />

        case "password":
            return <Input {...commonProps} type="password" />

        case "card-radio-group":
            return <CardRadioGroup
                {...commonProps}
                onChange={(e) => field.handleChange(e)}
                items={item?.items || []}
                defaultValue={field.state.value}
                {...(item?.configs || {})}
            />
        /**
         * For new input type, insert above this comment
         */
        default:
            return <Input {...commonProps} type="text" />
    }
}

export const SmartForm = ({
    formInstance,
    inputItems,
    formClassName
}: SmartFormPropsInterface) => {
    return (
        <form
            id={formInstance?._formId}
            onSubmit={(e) => {
                e.preventDefault()
                formInstance.handleSubmit()
            }}
        >
            <FieldGroup>
                <div className={cn('grid grid-cols-1 gap-4', formClassName)}>
                    {
                        inputItems.map((item, index) => (
                            <formInstance.Field
                                key={index}
                                name={item.key}
                                children={(field: AnyFieldApi) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            {item?.label && <FieldLabel htmlFor={field.name}>{item?.label}</FieldLabel>}
                                            {
                                                item?.render ? item?.render(field) :
                                                    renderInputField({
                                                        type: item?.type,
                                                        field,
                                                        item
                                                    })
                                            }
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    )
                                }

                                }

                            />
                        ))
                    }
                </div>
            </FieldGroup>

        </form>
    )
}