import React, { useState, useCallback } from 'react';
import { Shield, Server, Key, ArrowDown, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TerminalCard from '@/components/TerminalCard';
import NumberInput from '@/components/NumberInput';
import EncryptedValue from '@/components/EncryptedValue';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import DecryptionPanel from '@/components/DecryptionPanel';
import { mockEncrypt, mockHomomorphicAdd, generateMockKeyPair } from '@/lib/mockEncryption';
import { toast } from '@/hooks/use-toast';

type Step = 'input' | 'encrypting' | 'sending' | 'computing' | 'complete';

const Index = () => {
  const [values, setValues] = useState<number[]>([42, 17]);
  const [encryptedValues, setEncryptedValues] = useState<string[]>([]);
  const [encryptedResult, setEncryptedResult] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('input');
  const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);

  const resetDemo = () => {
    setStep('input');
    setEncryptedValues([]);
    setEncryptedResult(null);
    setKeys(null);
  };

  const runDemo = useCallback(async () => {
    // Generate keys
    const newKeys = generateMockKeyPair();
    setKeys(newKeys);
    
    toast({
      title: "Keys Generated",
      description: "Your cryptographic key pair has been created.",
    });

    // Step 1: Encrypt values
    setStep('encrypting');
    await new Promise(r => setTimeout(r, 1500));
    
    const encrypted = values.map(v => mockEncrypt(v));
    setEncryptedValues(encrypted);
    
    toast({
      title: "Values Encrypted",
      description: `${values.length} values encrypted with CKKS scheme.`,
    });

    // Step 2: Send to server
    setStep('sending');
    await new Promise(r => setTimeout(r, 1000));

    // Step 3: Compute on server
    setStep('computing');
    await new Promise(r => setTimeout(r, 2000));
    
    // Simulate homomorphic addition
    let result = encrypted[0];
    for (let i = 1; i < encrypted.length; i++) {
      result = mockHomomorphicAdd(result, encrypted[i]);
    }
    setEncryptedResult(result);

    toast({
      title: "Computation Complete",
      description: "Server performed homomorphic addition on encrypted data.",
    });

    // Step 4: Complete
    setStep('complete');
  }, [values]);

  const expectedSum = values.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 glow-primary">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Lattigo <span className="text-primary text-glow">HE</span> Demo
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  Homomorphic Encryption Simulator
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
              <Sparkles className="w-3 h-3 text-accent" />
              <span className="text-xs font-mono text-accent">Demo Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-lg bg-secondary/30 border border-border flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">How Homomorphic Encryption Works</p>
            <p>
              This demo simulates the <span className="text-primary font-mono">CKKS</span> scheme from Lattigo.
              Values are encrypted client-side, sent to a server that computes on encrypted data,
              and results can only be decrypted with your private key. The server never sees plaintext values.
            </p>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Step 1: Client Input */}
          <TerminalCard title="client.wasm — Input Values">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs text-primary font-bold">
                  1
                </div>
                Client-Side Encryption
              </div>
              
              <NumberInput 
                values={values} 
                onValuesChange={setValues}
                disabled={step !== 'input'}
              />

              {step === 'input' && (
                <Button 
                  variant="cyber" 
                  className="w-full"
                  onClick={runDemo}
                >
                  <Key className="w-4 h-4" />
                  Generate Keys & Encrypt
                </Button>
              )}

              {keys && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs text-muted-foreground font-mono">
                    Public Key (truncated):
                  </div>
                  <code className="block p-2 rounded bg-secondary text-xs text-primary/80 font-mono break-all">
                    {keys.publicKey.slice(0, 40)}...
                  </code>
                </div>
              )}

              {encryptedValues.length > 0 && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                    Encrypted Values:
                  </div>
                  {encryptedValues.map((enc, i) => (
                    <EncryptedValue 
                      key={i}
                      value={enc.slice(0, 50) + '...'}
                      label={`Enc(${values[i]})`}
                      isAnimating={step === 'encrypting'}
                    />
                  ))}
                </div>
              )}
            </div>
          </TerminalCard>

          {/* Step 2: Server Computation */}
          <TerminalCard title="server.go — HE Computation" glowColor="accent">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/50 flex items-center justify-center text-xs text-accent font-bold">
                  2
                </div>
                Server-Side Processing
              </div>

              <div className="p-4 rounded-md bg-secondary/30 border border-border">
                <div className="font-mono text-xs text-muted-foreground space-y-1">
                  <div><span className="text-accent">func</span> <span className="text-foreground">AddEncrypted</span>(ct1, ct2) {'{'}</div>
                  <div className="pl-4 text-primary">// Server NEVER sees plaintext</div>
                  <div className="pl-4"><span className="text-accent">return</span> evaluator.Add(ct1, ct2)</div>
                  <div>{'}'}</div>
                </div>
              </div>

              {(step === 'sending' || step === 'computing') && (
                <ProcessingAnimation isProcessing={true} />
              )}

              {step === 'complete' && encryptedResult && (
                <div className="animate-scale-in">
                  <EncryptedValue 
                    value={encryptedResult.slice(0, 60) + '...'}
                    label="Encrypted Sum Result"
                    isAnimating={false}
                  />
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Server className="w-3 h-3" />
                    Server computed Σ Enc(xᵢ) without decryption
                  </div>
                </div>
              )}

              {step === 'input' && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Server className="w-12 h-12 mb-3 opacity-30" />
                  <span className="text-sm font-mono">Awaiting encrypted data...</span>
                </div>
              )}
            </div>
          </TerminalCard>

          {/* Step 3: Client Decryption */}
          <TerminalCard title="client.wasm — Decrypt Result">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs text-primary font-bold">
                  3
                </div>
                Client-Side Decryption
              </div>

              {step === 'complete' && keys ? (
                <DecryptionPanel 
                  encryptedResult={encryptedResult}
                  expectedSum={expectedSum}
                  generatedPrivateKey={keys.privateKey}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Key className="w-12 h-12 mb-3 opacity-30" />
                  <span className="text-sm font-mono">
                    {step === 'input' 
                      ? 'Run encryption first...' 
                      : 'Processing...'}
                  </span>
                </div>
              )}
            </div>
          </TerminalCard>
        </div>

        {/* Reset Button */}
        {step === 'complete' && (
          <div className="mt-8 text-center animate-fade-in">
            <Button variant="outline" onClick={resetDemo}>
              Reset Demo
            </Button>
          </div>
        )}

        {/* Architecture Note */}
        <div className="mt-12 p-6 rounded-lg bg-card border border-border">
          <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Real Implementation Architecture
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-xs text-muted-foreground font-mono">
            <div className="p-3 rounded bg-secondary/50">
              <div className="text-primary mb-1">Client (WASM)</div>
              <p>Lattigo compiled to WebAssembly handles key generation, encryption, and decryption locally in the browser.</p>
            </div>
            <div className="p-3 rounded bg-secondary/50">
              <div className="text-accent mb-1">Server (Go)</div>
              <p>Go backend with Lattigo performs homomorphic operations on ciphertexts without access to private keys.</p>
            </div>
            <div className="p-3 rounded bg-secondary/50">
              <div className="text-foreground mb-1">Security</div>
              <p>Private key never leaves the client. Server only sees encrypted data and returns encrypted results.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Demo simulating <span className="text-primary">Lattigo CKKS</span> homomorphic encryption scheme
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
