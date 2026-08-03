import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header, { type ViewMode } from '@/components/Header';
import CommunityView from '@/components/community/CommunityView';
import AnalyticsView from '@/components/analytics/AnalyticsView';

function App() {
  const [view, setView] = useState<ViewMode>('comunidad');

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header view={view} onViewChange={setView} />
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {view === 'comunidad' ? <CommunityView /> : <AnalyticsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
