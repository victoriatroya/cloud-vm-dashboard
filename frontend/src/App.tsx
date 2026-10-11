function App() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Cloud VM Dashboard</h1>
        <p className="mt-2 text-text-muted">Tailwind y tokens funcionando</p>
        <button
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          Alternar dark mode
        </button>
      </div>
    </main>
  );
}

export default App;
