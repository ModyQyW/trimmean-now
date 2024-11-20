import { Button } from "primereact/button";

const App = () => {
  return (
    <div className="mx-auto sm:px-6 lg:px-8 max-w-7xl p-20">
      <header className="text-center">
        <h1 className="text-3xl font-medium">Trimmean Now 🏃</h1>
      </header>
      <main className="mt-12 max-w-[512px] mx-auto w-4/5 text-center">
        <Button>GO</Button>
      </main>
    </div>
  );
};

export default App;
