export default function LivePreview() {
  return (
    <div className="sticky top-6">
      <h3 className="text-lg font-semibold mb-4">Live Preview</h3>

      <div className="rounded-2xl overflow-hidden shadow-lg bg-blue-900 text-white p-6">
        <h2 className="text-3xl font-bold mb-4">
          Achieve Your Goals
        </h2>
        <p className="mb-6 opacity-90">
          Expert-led coaching | Proven results | Your success is our mission.
        </p>

        <div className="flex gap-4">
          <button className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold">
            Get Started
          </button>
          <button className="border border-white px-4 py-2 rounded-lg">
            Watch Video
          </button>
        </div>
      </div>
    </div>
  );
}