import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Unlock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { mockDecrypt } from '@/lib/mockEncryption';

interface DecryptionPanelProps {
  encryptedResult: string | null;
  expectedSum: number;
  generatedPrivateKey: string;
}

const DecryptionPanel: React.FC<DecryptionPanelProps> = ({ 
  encryptedResult, 
  expectedSum,
  generatedPrivateKey 
}) => {
  const [privateKey, setPrivateKey] = useState('');
  const [decryptedValue, setDecryptedValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const handleDecrypt = () => {
    if (!encryptedResult) {
      setError('No encrypted result to decrypt');
      return;
    }

    const result = mockDecrypt(encryptedResult, privateKey, expectedSum);
    
    if (result === null) {
      setError('Invalid private key. Try using the generated key or any key with 16+ characters.');
      setDecryptedValue(null);
    } else {
      setError(null);
      setDecryptedValue(result);
    }
  };

  const useGeneratedKey = () => {
    setPrivateKey(generatedPrivateKey);
    setError(null);
    setDecryptedValue(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground font-mono flex items-center gap-2">
            <Key className="w-4 h-4" />
            Private Key
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={useGeneratedKey}
            className="text-xs text-primary hover:text-primary/80"
          >
            Use Generated Key
          </Button>
        </div>
        
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            value={privateKey}
            onChange={(e) => {
              setPrivateKey(e.target.value);
              setError(null);
              setDecryptedValue(null);
            }}
            placeholder="Enter your private key..."
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button 
        variant="cyber" 
        className="w-full" 
        onClick={handleDecrypt}
        disabled={!encryptedResult || !privateKey}
      >
        <Unlock className="w-4 h-4" />
        Decrypt Result
      </Button>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {decryptedValue !== null && (
        <div className="animate-scale-in">
          <div className="p-6 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/50 glow-primary">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground font-mono">Decryption Successful</span>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary text-glow font-mono">
                {decryptedValue.toFixed(2)}
              </span>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Sum of encrypted values
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecryptionPanel;
