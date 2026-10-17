import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { X, Send, Bot, User as UserIcon, BookOpen, Clock, HelpCircle, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'librarian' | 'student';
  text: string;
  timestamp: string;
}

const COMMON_QUERIES = [
  {
    label: 'How to renew my book?',
    answer: 'You can renew eligible loans up to 2 times (+14 days each) directly from your "My Loans" page or the Due-Date Reminder panel, provided another student is not currently on the waiting list.',
  },
  {
    label: 'Where is the Quantum Wing?',
    answer: 'The Quantum Wing and High-Performance Physics Lab are on Floor 2 of the Science Quad, adjacent to Pod 8. Study carrels there feature cryogenic noise reduction.',
  },
  {
    label: 'What is the overdue fine rate?',
    answer: 'Our university library circulation policy applies a modest fee of $0.50 per day per volume following the grace period. All fines are reinvested into student digital textbook licenses.',
  },
  {
    label: 'How does the reservation queue work?',
    answer: 'When a book has 0 available copies, click "Reserve My Copy". You are automatically assigned the next priority queue rank. The instant the book is returned, you will receive a pickup alert with a 48-hour hold at the Circulation Desk.',
  },
];

export const AskLibrarianModal: React.FC = () => {
  const { isAskLibrarianOpen, setIsAskLibrarianOpen, currentUser, showToast } = useLibrary();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'librarian',
      text: `Greetings ${currentUser ? currentUser.name.split(' ')[0] : 'Scholar'}. I am Dr. Eleanor Vance, Head Librarian of LibraVerse. How may our circulation desk assist your research today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAskLibrarianOpen) return null;

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const studentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, studentMsg]);
    setInputQuestion('');
    setIsTyping(true);

    // Contextual smart response based on keywords
    setTimeout(() => {
      let reply = `Thank you for your inquiry regarding "${textToSend}". I have filed reference ticket #LIB-${Math.floor(1000 + Math.random() * 9000)}. Our digital archives team is monitoring this and will assist you at the Circulation Desk or via university email.`;

      const lower = textToSend.toLowerCase();
      if (lower.includes('renew') || lower.includes('extend') || lower.includes('due')) {
        reply = COMMON_QUERIES[0].answer;
      } else if (lower.includes('where') || lower.includes('location') || lower.includes('shelf') || lower.includes('quantum')) {
        reply = COMMON_QUERIES[1].answer;
      } else if (lower.includes('fine') || lower.includes('fee') || lower.includes('cost') || lower.includes('overdue')) {
        reply = COMMON_QUERIES[2].answer;
      } else if (lower.includes('reserve') || lower.includes('hold') || lower.includes('waitlist')) {
        reply = COMMON_QUERIES[3].answer;
      } else if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('ai')) {
        reply = `Our Smart Recommendations tab utilizes algorithmic discipline matching based on your course syllabus and previous borrowing history. You can also customize your active interest tags under 'Smart Picks'!`;
      }

      const librarianMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'librarian',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, librarianMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/20">
                EV
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Dr. Eleanor Vance</span>
                <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Head Librarian
                </span>
              </h3>
              <p className="text-xs text-slate-400">LibraVerse Research & Circulation Desk</p>
            </div>
          </div>

          <button
            onClick={() => setIsAskLibrarianOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === 'student'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-violet-900/60 text-violet-300 border border-violet-700/50'
                }`}
              >
                {msg.sender === 'student' ? (currentUser?.name.charAt(0) || 'U') : <BookOpen className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'student'
                    ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 font-mono ${
                    msg.sender === 'student' ? 'text-slate-900/70' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono italic">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Dr. Vance is reviewing catalog records...</span>
            </div>
          )}
        </div>

        {/* Quick Query Pills / Buttons */}
        <div className="p-3 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2">
          {COMMON_QUERIES.map(q => (
            <button
              key={q.label}
              onClick={() => handleSendMessage(q.label)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800 rounded-lg whitespace-nowrap transition-colors border border-slate-700/50"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={e => setInputQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputQuestion)}
            placeholder="Type your question for the librarian..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            onClick={() => handleSendMessage(inputQuestion)}
            disabled={!inputQuestion.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
