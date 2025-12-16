import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface NumberInputProps {
  values: number[];
  onValuesChange: (values: number[]) => void;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  values, 
  onValuesChange,
  disabled = false 
}) => {
  const addValue = () => {
    onValuesChange([...values, 0]);
  };

  const removeValue = (index: number) => {
    if (values.length > 2) {
      const newValues = values.filter((_, i) => i !== index);
      onValuesChange(newValues);
    }
  };

  const updateValue = (index: number, newValue: string) => {
    const numValue = parseFloat(newValue) || 0;
    const newValues = [...values];
    newValues[index] = numValue;
    onValuesChange(newValues);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-mono">
          Enter numbers to encrypt and sum
        </span>
        <Button 
          variant="terminal" 
          size="sm"
          onClick={addValue}
          disabled={disabled || values.length >= 5}
        >
          <Plus className="w-4 h-4" />
          Add Value
        </Button>
      </div>
      
      <div className="grid gap-3">
        {values.map((value, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-xs text-muted-foreground font-mono w-8">
              x{index + 1}:
            </span>
            <Input
              type="number"
              value={value}
              onChange={(e) => updateValue(index, e.target.value)}
              placeholder="Enter a number..."
              disabled={disabled}
              className="flex-1"
            />
            {values.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeValue(index)}
                disabled={disabled}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-mono">Plaintext Sum:</span>
          <span className="text-primary font-mono font-bold text-lg">
            {values.reduce((a, b) => a + b, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NumberInput;
