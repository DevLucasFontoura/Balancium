'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Button } from '@/components/ui/Button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';

interface DatePickerProps {
  date?: Date;
  onChange: (date: Date | undefined) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
          ) : (
            <span>Selecione uma data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(date) => {
            setSelected(date);
            onChange(date);
          }}
          locale={ptBR}
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
} 