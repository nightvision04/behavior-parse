
'use client';

import { useState } from 'react';
import Image from 'next/image';
import '../app/globals.css'

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(''); // Clear previous response
    try {
      const res = await fetch('/api/send-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let content = '';

        const processText = async ({ done, value }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
          if (done) {
            setIsLoading(false);
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          content += chunk;
          setResponse(content);
          return reader.read().then(processText);
        };

        reader.read().then(processText);
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      setResponse('Failed to fetch response.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
  <header className="absolute inset-x-0 top-0 z-50">
    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div className="flex lg:flex-1">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <Image className="h-8 w-auto" width='300' height='300' src="/logo.png" alt="" />
        </a>
      </div>
      <div className="flex lg:hidden">
        <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">Chat</a>
        <a href="#" className="text-sm font-semibold leading-6 text-gray-900">About</a>
      </div>

    </nav>

    <div className="lg:hidden" role="dialog" aria-modal="true">

      <div className="fixed inset-0 z-50"></div>
      <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Behavior Parsing</span>
            <Image className="h-8 w-auto" width='300' height='300' src="/logo.png" alt="" />
          </a>
          <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Chat</a>
              <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">About</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div className="relative isolate px-6 pt-14 lg:px-8">

    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        
        
        <form onSubmit={handleSubmit}>
        <textarea
          className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
          placeholder="Write something.."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Prompt'}
        </button>
        </form>

      </div>
      <div className="text-center">
       
        <p className="mt-6 text-lg leading-8 text-gray-600">{response}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a href="#" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send</a>
        </div>
      </div>
    </div>
  </div>
</div>
  );


}
