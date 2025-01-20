export default function Page({ children, header }: { children: React.ReactNode; header?: React.ReactNode }) {
  return (
    <>
      {header && (
        <header className="bg-white shadow-xs">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-lg/6 font-semibold text-gray-900">{header}</h1>
          </div>
        </header>
      )}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  );
}
