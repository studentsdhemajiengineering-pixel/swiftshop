'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export function ChatWidget() {
  const [messages, setMessages] = useState([
    { from: 'support', text: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      setInput('');
      // Mock support reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { from: 'support', text: 'Thanks for your message! An agent will be with you shortly.' },
        ]);
      }, 1500);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl"
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 mr-4" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Support Chat</h4>
            <p className="text-sm text-muted-foreground">
              We're here to help!
            </p>
          </div>
          <Separator />
          <div className="h-64 space-y-4 overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.from === 'support' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>S</AvatarFallback>
                  </Avatar>
                )}
                <p
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    msg.from === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
