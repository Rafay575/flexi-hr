'use client';

import * as React from 'react';
import { useForm, Controller, RegisterOptions } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea'; // if you have one
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
/* =========================
   Field types & props
   ========================= */

type BaseField = {
  name: string;
  label: string;
  rules?: RegisterOptions;
  helpText?: string;
};

export type FieldDescriptor =
  | ({ type: 'text'; placeholder?: string } & BaseField)
  | ({ type: 'number'; placeholder?: string } & BaseField)
  | ({ type: 'textarea'; placeholder?: string; rows?: number } & BaseField)
  | ({ type: 'checkbox'; description?: string } & BaseField)
  | ({
      type: 'combo';
      Combo: React.ComponentType<any>;
      options: any[];
      placeholder?: string;
    } & BaseField)
  | ({
      type: 'select';
      options: { value: string; label: string }[];
      placeholder?: string;
    } & BaseField);

interface Props {
  open: boolean;
  onClose: () => void;
 onSave: ((formData: Record<string, any>) => void | Promise<void>) | (() => void | Promise<void>);
  initialData?: Record<string, any>;
  fields: FieldDescriptor[];
  title: string;
  closeOnSave?: boolean;
   form?: UseFormReturn<any>;
  /** optionally force a submitting state from parent (e.g., while a mutation runs) */
  submitting?: boolean;
}

export default function DynamicModal({
  open,
  onClose,
  onSave,
  initialData = {},
  fields,
  title,
  closeOnSave = true,
  submitting: submittingExternal,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, any>>({
    defaultValues: initialData,
    mode: 'onSubmit',
  });

  // Reset form when data changes
  React.useEffect(() => {
    reset(initialData);
  }, [initialData, open, reset]);

  const submitting = submittingExternal ?? isSubmitting;

  const onSubmit = async (data: Record<string, any>) => {
    await onSave(data); // await async parent handler if it returns a Promise
    if (closeOnSave) onClose();
  };

  // Prevent closing via Esc / outside click while submitting
  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting) return;
    if (!nextOpen) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {fields.map((field) => {
            const rules: RegisterOptions = { ...(field.rules || {}) };

            switch (field.type) {
              case 'text':
              case 'number': {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor={field.name}>
                      {field.label}
                      {rules?.required ? <span className="text-red-600">*</span> : null}
                    </label>
                    <Input
                      id={field.name}
                      type={field.type === 'number' ? 'number' : 'text'}
                      placeholder={field.placeholder ?? field.label}
                      {...register(field.name, rules)}
                    />
                    {field.helpText && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">
                        {String(errors[field.name]?.message ?? 'This field is required')}
                      </p>
                    )}
                  </div>
                );
              }

              case 'textarea': {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor={field.name}>
                      {field.label}
                      {rules?.required ? <span className="text-red-600">*</span> : null}
                    </label>
                    <Textarea
                      id={field.name}
                      placeholder={field.placeholder ?? field.label}
                      rows={field.rows ?? 3}
                      {...register(field.name, rules)}
                    />
                    {field.helpText && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">
                        {String(errors[field.name]?.message ?? 'This field is required')}
                      </p>
                    )}
                  </div>
                );
              }

              case 'checkbox': {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <Controller
                      name={field.name}
                      control={control}
                      rules={rules}
                      render={({ field: ctl }) => (
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={field.name}
                            checked={!!ctl.value}
                            onCheckedChange={(v) => ctl.onChange(Boolean(v))}
                          />
                          <div className="grid gap-1 leading-none">
                            <label
                              htmlFor={field.name}
                              className="text-sm font-medium leading-none"
                            >
                              {field.label}
                              {rules?.required ? <span className="text-red-600 ml-0.5">*</span> : null}
                            </label>
                            {'description' in field && field.description ? (
                              <p className="text-xs text-muted-foreground">
                                {field.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      )}
                    />
                    {field.helpText && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">
                        {String(errors[field.name]?.message ?? 'This field is required')}
                      </p>
                    )}
                  </div>
                );
              }

              case 'combo': {
                const Combo = field.Combo;
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor={field.name}>
                      {field.label}
                      {rules?.required ? <span className="text-red-600">*</span> : null}
                    </label>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={rules}
                      render={({ field: ctl }) => (
                        <Combo
                          id={field.name}
                          value={ctl.value}
                          onChange={ctl.onChange}
                          onBlur={ctl.onBlur}
                          options={field.options}
                          placeholder={field.placeholder ?? field.label}
                        />
                      )}
                    />
                    {field.helpText && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">
                        {String(errors[field.name]?.message ?? 'This field is required')}
                      </p>
                    )}
                  </div>
                );
              }

              case 'select': {
                return (
                  <div key={field.name} className="space-y-1.5">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={rules}
                      render={({ field: ctl }) => (
                        <Select value={ctl.value ?? ''} onValueChange={ctl.onChange} >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={field.placeholder ?? field.label} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {field.helpText && (
                      <p className="text-xs text-muted-foreground">{field.helpText}</p>
                    )}
                    {errors[field.name] && (
                      <p className="text-xs text-red-600">
                        {String(errors[field.name]?.message ?? 'This field is required')}
                      </p>
                    )}
                  </div>
                );
              }

              default:
                return null;
            }
          })}

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
