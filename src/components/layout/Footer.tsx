export default function Footer() {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-200">
              © {new Date().getFullYear()} Affiliate Marketers
            </span>
            <p className="text-xs text-slate-400">Professional Lead Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">Status:</span> All Systems Operational
          </div>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </footer>
  );
}
