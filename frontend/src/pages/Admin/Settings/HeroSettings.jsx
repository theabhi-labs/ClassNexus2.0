export default function HeroSettings() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hero Section Settings</h2>

      <div className="space-y-6">
        
        <div>
          <label className="block font-medium mb-2">Hero Title</label>
          <input
            type="text"
            placeholder="Achieve Your Goals"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Hero Subtitle</label>
          <textarea
            rows="3"
            placeholder="Expert-led coaching | Proven results..."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Primary Button Text</label>
          <input
            type="text"
            placeholder="Get Started"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Secondary Button Text</label>
          <input
            type="text"
            placeholder="Watch Video"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-6 border-t">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}