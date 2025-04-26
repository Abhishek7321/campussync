import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Bot, Send, AlertCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import './dialogflow-messenger.css';

// Define message interface for type safety
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Initial welcome message
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    content: 'Hi there! I\'m CampusBot Meera, your virtual assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(),
  },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [useDialogflow, setUseDialogflow] = useState(true);
  const [dialogflowLoaded, setDialogflowLoaded] = useState(false);
  const [dialogflowError, setDialogflowError] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dfMessengerRef = useRef<HTMLElement | null>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initialize and handle Dialogflow Messenger
  useEffect(() => {
    const checkDialogflowLoaded = () => {
      try {
        const dfMessenger = document.querySelector('df-messenger');
        if (dfMessenger) {
          dfMessengerRef.current = dfMessenger as HTMLElement;
          setDialogflowLoaded(true);
          return true;
        }
      } catch (error) {
        console.error("Error checking Dialogflow:", error);
      }
      return false;
    };

    const handleDialogflowError = () => {
      console.error("Failed to load Dialogflow");
      setDialogflowError(true);
      setUseDialogflow(false);
    };
    
    const isLoaded = checkDialogflowLoaded();
    
    if (!isLoaded) {
      const timeoutId = setTimeout(() => {
        if (!checkDialogflowLoaded()) {
          handleDialogflowError();
        }
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (dfMessengerRef.current && dialogflowLoaded) {
      dfMessengerRef.current.setAttribute('expand', newIsOpen ? 'true' : 'false');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    setTimeout(() => {
      const userInput = userMessage.content.toLowerCase();
      
      // Check for specific questions
      let botReply = '';


      if (
        userInput.includes('hi') ||
        userInput.includes('hello') ||
        userInput.includes('hey')||
        userInput.includes('heya') ||
        userInput.includes('howdy') ||
        userInput.includes('hii')
      ) {
        botReply = "Hello! 👋 How can I assist you today?";
      }
      else if (userInput.includes('roll number')||
      userInput.includes('roll no.') ||
      userInput.includes('Roll no') ||
      userInput.includes('Roll number')) {
        botReply = "Your roll number can be found in your student profile under the 'Personal Information' section.";
      } else if (userInput.includes('student id')||
      userInput.includes('Std ID') ||
      userInput.includes('Student ID') ) {
        botReply = "Your student ID is the unique number assigned to you upon admission. You can find it on your ID card or student portal.";
      } else if (userInput.includes('next event') || userInput.includes('upcoming event')) {
        botReply = "The next big event is the 'Tech Startup Workshop' happening on May 5th! Check the events page for more upcoming events.";
      } else if (userInput.includes('exam schedule')) {
        botReply = "The exam schedule is available under the 'Academics' tab in your portal.";
      } else if (userInput.includes('library time')) {
        botReply = "The campus library is open from 8 AM to 10 PM, Monday through Saturday.";
      } else if (userInput.includes('cafeteria menu')) {
        botReply = "Today's cafeteria menu includes pasta, sandwiches, and a special vegan option!";
      } else if (userInput.includes('placement drive')) {
        botReply = "The placement drive is scheduled for June 10th. Register through the Placement Cell portal.";
      } 
      else if (userInput.includes('attendance')||
      userInput.includes('Attendance')||
      userInput.includes('atd')) {
        botReply = "You can check your attendence in your profile section";
      }
      else if (userInput.includes('Mentor')||
      userInput.includes('teacher')||
      userInput.includes('Faculty')) {
        botReply = "You can check your assigned faculty from your Acedemic details";
      }
      else {
        // Default random response if no match
        const botResponses = [
          "I can help you with that! What specific information do you need?",
          "That's a great question. Let me find the answer for you.",
          "I'm checking the campus resources for that information.",
          "Have you checked the campus calendar for upcoming events?",
          "You might want to visit the student services office for more details on that.",
          "I recommend checking the university website for the most up-to-date information.",
          "Is there anything else you'd like to know about campus services?",
        ];
        botReply = botResponses[Math.floor(Math.random() * botResponses.length)];
      }
      
      const botMessage: Message = {
        id: Date.now().toString(),
        content: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const retryDialogflow = () => {
    setDialogflowError(false);
    setDialogflowLoaded(false);
    setUseDialogflow(true);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-gradient-primary hover:opacity-90"
        )}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageSquare className="h-6 w-6 text-white" />}
      </button>
      
      {useDialogflow ? (
        <div className="fixed bottom-0 right-0 z-40">
          {!dialogflowLoaded && !dialogflowError && isOpen && (
            <div className="fixed bottom-44 right-6 z-50 w-[350px] md:w-[350px] rounded-lg shadow-xl bg-white p-6">
              <div className="flex flex-col items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Loading chatbot...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "fixed bottom-44 right-6 z-50 w-[350px] md:w-[350px] rounded-lg shadow-xl transition-all duration-300 transform",
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          )}
        >
          <Card className="border-2 border-primary/20 overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between bg-primary/10">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">Meera</h3>
                  <p className="text-xs text-muted-foreground">Virtual Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-0 h-[430px] relative">
              <div className="h-[380px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted">
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <CardFooter className="p-2 border-t">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button type="submit" size="icon" className="h-9 w-9">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}