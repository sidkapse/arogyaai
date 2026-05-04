import { BottomNav } from '../components/BottomNav';
import { ChatPanel } from '../components/ChatPanel';

export function ChatRoute() {
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <div className="flex-1 flex flex-col">
        <div className="px-5 pt-12 pb-4 bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <h1 className="text-2xl font-extrabold">AI Tutor 🤖</h1>
          <p className="text-white/80 text-sm mt-1">Ask anything about any of the 9 ailments</p>
        </div>
        <div className="flex-1">
          <ChatPanel ailment={null} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
