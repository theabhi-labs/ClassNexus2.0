import { useState } from "react";

export default function StatsSettings() {
  const [stats, setStats] = useState([
    {
      number: "10+",
      title: "Years Experience",
      desc: "Trusted since 2015",
    },
    {
      number: "50+",
      title: "Expert Faculty",
      desc: "IIT & NIT alumni",
    },
    {
      number: "1000+",
      title: "Study Notes",
      desc: "High-quality & conceptual",
    },
    {
      number: "95%",
      title: "Success Rate",
      desc: "Consistent top results",
    },
  ]);

  const handleChange = (index, field, value) => {
    const updatedStats = [...stats];
    updatedStats[index][field] = value;
    setStats(updatedStats);
  };

  const handleSave = () => {
    console.log("Saved Stats:", stats);
    alert("Stats Saved Successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Statistics Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-2xl p-6 shadow-sm"
          >
            <div className="space-y-4">
              
              <div>
                <label className="block font-medium mb-1">
                  Number
                </label>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) =>
                    handleChange(index, "number", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={stat.title}
                  onChange={(e) =>
                    handleChange(index, "title", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={stat.desc}
                  onChange={(e) =>
                    handleChange(index, "desc", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}