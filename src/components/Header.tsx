import React from 'react';
import { Menu } from 'lucide-react';
import { AdvisorLogo } from './AdvisorLogo';

interface HeaderProps {
  onOpenMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Official Authority Logo & Title */}
        <div className="flex items-center gap-3">
          {/* Official Emblem of the National Organization for Social Insurance */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-md border-2 border-white/90 flex items-center justify-center p-0.5">
              <AdvisorLogo className="w-full h-full object-contain" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              مستشار التأمينات والمعاشات
            </h1>
            <p className="text-xs text-emerald-400 font-medium">
              الهيئة القومية للتأمين الاجتماعي
            </p>
          </div>
        </div>

        {/* Side Menu Button */}
        <button
          onClick={onOpenMenu}
          type="button"
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 border border-emerald-500/30 cursor-pointer"
          aria-label="فتح القائمة الجانبية والخيارات"
          title="فتح القائمة الجانبية والخيارات"
        >
          <Menu className="w-5 h-5 text-emerald-200" />
          <span>القائمة</span>
        </button>
      </div>
    </header>
  );
};
