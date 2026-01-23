import { useState } from "react";

const dummyStudents = [
  {
    id: 1,
    name: "Rahul Kumar",
    feeType: "MONTHLY",
    monthlyFee: 2000,
    totalFee: null,
    joinMonth: "2025-01",
  },
  {
    id: 2,
    name: "Amit Sharma",
    feeType: "ONE_TIME",
    monthlyFee: null,
    totalFee: 12000,
    joinMonth: "2025-01",
  },
];

const Payment = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    month: "",
    mode: "UPI",
  });

  const handlePayment = (e) => {
    e.preventDefault();
    if (!selectedStudent || !form.amount) return;

    setPayments([
      ...payments,
      {
        id: Date.now(),
        studentId: selectedStudent.id,
        amount: Number(form.amount),
        month: selectedStudent.feeType === "MONTHLY" ? form.month : null,
        mode: form.mode,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setForm({ amount: "", month: "", mode: "UPI" });
  };

  const studentPayments = payments.filter(
    (p) => p.studentId === selectedStudent?.id
  );

  const paidAmount = studentPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const getExpectedAmount = () => {
    if (!selectedStudent) return 0;

    if (selectedStudent.feeType === "ONE_TIME") {
      return selectedStudent.totalFee;
    }

    const start = new Date(selectedStudent.joinMonth + "-01");
    const now = new Date();
    const months =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth() + 1);

    return months * selectedStudent.monthlyFee;
  };

  const expectedAmount = getExpectedAmount();
  const pendingAmount = expectedAmount - paidAmount;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment Management</h1>

      {/* Student Select */}
      <select
        className="border p-3 rounded w-full md:w-1/2"
        onChange={(e) =>
          setSelectedStudent(
            dummyStudents.find((s) => s.id === Number(e.target.value))
          )
        }
      >
        <option value="">Select Student</option>
        {dummyStudents.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {selectedStudent && (
        <>
          {/* Fee Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <SummaryCard title="Fee Type" value={selectedStudent.feeType} />
            <SummaryCard
              title="Expected Fee"
              value={`₹${expectedAmount}`}
            />
            <SummaryCard title="Paid" value={`₹${paidAmount}`} />
            <SummaryCard
              title="Pending"
              value={`₹${pendingAmount}`}
              danger={pendingAmount > 0}
            />
          </div>

          {/* Add Payment */}
          <form
            onSubmit={handlePayment}
            className="bg-white p-6 rounded shadow space-y-4"
          >
            <h2 className="font-semibold">Add Payment</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Amount"
                className="border p-3 rounded"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              {selectedStudent.feeType === "MONTHLY" && (
                <input
                  type="month"
                  className="border p-3 rounded"
                  value={form.month}
                  onChange={(e) =>
                    setForm({ ...form, month: e.target.value })
                  }
                />
              )}

              <select
                className="border p-3 rounded"
                value={form.mode}
                onChange={(e) =>
                  setForm({ ...form, mode: e.target.value })
                }
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank</option>
              </select>
            </div>

            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              Save Payment
            </button>
          </form>

          {/* Payment History */}
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Month</th>
                  <th className="p-3">Mode</th>
                </tr>
              </thead>
              <tbody>
                {studentPayments.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No payments yet
                    </td>
                  </tr>
                )}
                {studentPayments.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.date}</td>
                    <td className="p-3">₹{p.amount}</td>
                    <td className="p-3">{p.month || "-"}</td>
                    <td className="p-3">{p.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, danger }) => (
  <div className="bg-white p-5 rounded shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2
      className={`text-xl font-bold mt-1 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {value}
    </h2>
  </div>
);

export default Payment;
