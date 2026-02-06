'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function AdminAccess() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Listen for Ctrl+Shift+A or Cmd+Shift+A
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        setShowPrompt(true);
        return;
      }

      // Secret sequence: type "admin" quickly
      if (typeof event.key === 'string') {
        const key = event.key.toLowerCase();
        if (key.match(/[a-z]/)) {
          setKeySequence(prev => {
            const newSequence = [...prev, key].slice(-5); // Keep last 5 keys
            // Check if sequence spells "admin"
            if (newSequence.join('') === 'admin') {
              setShowPrompt(true);
              return [];
            }
            return newSequence;
          });
          // Clear sequence after 2 seconds of no typing
          setTimeout(() => {
            setKeySequence([]);
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminAccess = () => {
    router.push('/admin');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 mx-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Settings className="mr-2 text-blue-600" size={24} />
              <h3 className="text-lg font-bold">Admin Access</h3>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            You've triggered the admin access. This allows you to edit your portfolio content directly from the website.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Access Methods:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keyboard: <kbd className="bg-blue-200 px-1 rounded">Ctrl+Shift+A</kbd></li>
              <li>• Type: <kbd className="bg-blue-200 px-1 rounded">admin</kbd> anywhere</li>
              <li>• URL: <kbd className="bg-blue-200 px-1 rounded">/admin</kbd></li>
              <li>• Footer: Click the ⚙️ icon</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleAdminAccess} className="flex-1">
              <Settings size={16} className="mr-2" />
              Open Admin Panel
            </Button>
            <Button 
              onClick={() => setShowPrompt(false)} 
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}