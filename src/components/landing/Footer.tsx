export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-8">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-[13px] font-semibold text-zinc-400">Simply AI</p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              AI assistant setup for LA businesses.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+13613158585"
              className="text-[12px] text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
            >
              (361) 315-8585
            </a>
            <a
              href="mailto:hello@simplyai.tech"
              className="text-[12px] text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
            >
              hello@simplyai.tech
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 border-t border-white/[0.03]">
          <span className="text-[12px] text-zinc-700">
            &copy; {new Date().getFullYear()} Simply AI. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="/internal/legal"
              className="text-[12px] text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="/internal/terms"
              className="text-[12px] text-zinc-700 hover:text-zinc-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
