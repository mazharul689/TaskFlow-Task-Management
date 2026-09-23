
const Header = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0a0f1d]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-4">
                <div className="flex items-center gap-3">
                    <div>
                        <span className="text-3xl font-bold tracking-tight text-white">
                            Task<span className="text-indigo-400">Flow</span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;