import { useEffect, useState } from "react";
import { getAllStudentPayments, setupPayment, updatePayment } from "../../api/payment.api";

const Payment = () => {
  const [students, setStudents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [feeTypes, setFeeTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Data - EXACTLY AS YOUR ORIGINAL CODE
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await getAllStudentPayments();
        const data = res.data.data || [];

        setStudents(data);

        // Initialize fee types from backend
        const initialFeeTypes = {};
        data.forEach((student) => {
          initialFeeTypes[student.enrollmentId] =
            student.paymentType || "NONE";
        });
        setFeeTypes(initialFeeTypes);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Get latest payment from history
  const getLatestPayment = (history) => {
    if (!history || history.length === 0) return null;
    return [...history].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  };

  // Filter
  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading payments...</div>;

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or enrollment..."
        className="mb-4 px-4 py-2 border rounded w-full md:w-1/3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {/* Header - Action removed, added space for icon */}
        <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] font-semibold px-6 py-4 border-b dark:border-gray-700">
          <div></div>
          <div>Enrollment No</div>
          <div>Name</div>
          <div>Status</div>
          <div>Amount</div>
          <div>Payment Type</div>
        </div>

        {/* Rows */}
        {filteredStudents.map((student) => {
          const latest = getLatestPayment(student.history);

          const status = latest?.status || "PENDING";
          const amount = latest?.expectedAmount || student.coursePrice || 0;
          const isExpanded = expandedId === student.enrollmentId;

          return (
            <div key={student.enrollmentId} className="border-b dark:border-gray-700">
              {/* Clickable Row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : student.enrollmentId)}
                className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                {/* Dropdown Icon */}
                <div className="text-gray-500 flex items-center justify-center">
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div>{student.enrollmentNo}</div>
                <div>{student.name}</div>

                <div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${status === "PAID"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                      }`}
                  >
                    {status}
                  </span>
                </div>

                <div>₹{amount.toLocaleString("en-IN")}</div>

                <div className="capitalize">
                  {student.paymentType?.toLowerCase().replace("_", " ") || "None"}
                </div>
              </div>

              {/* Expanded Dropdown Content */}
              {isExpanded && (
                <ExpandedSection
                  student={student}
                  currentFeeType={feeTypes[student.enrollmentId] || "NONE"}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Component for expanded section to manage independent form state
const ExpandedSection = ({ student, currentFeeType }) => {
  const [feeType, setFeeType] = useState(currentFeeType);
  const [payAmount, setPayAmount] = useState("");
  const [payMonth, setPayMonth] = useState("");
  const [payMode, setPayMode] = useState("CASH");
  const [txnId, setTxnId] = useState("");
  const [payStatus, setPayStatus] = useState("PENDING");

  // Calculations for cards
  const history = student.history || [];
  const expectedFee = student.coursePrice || 0;
  const totalPaid = history.reduce(
    (sum, record) => sum + (Number(record.paidAmount) || 0),
    0
  );
  const pendingFee = expectedFee - totalPaid;

  const handleSaveFeeType = async () => {
    if (feeType === "NONE") {
      alert("Please select fee type");
      return;
    }

    try {
      await setupPayment({
        enrollmentId: student.enrollmentId,
        paymentType: feeType,
      });

      alert("Payment initialized successfully");

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to initialize payment"
      );
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();

    try {
      if (!student.history || student.history.length === 0) {
        alert("No initialized payment found. Please select fee type first.");
        return;
      }

      // latest payment record ka id lo
      const latestPayment = [...student.history].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];

      await updatePayment(latestPayment._id, {
        paidAmount: Number(payAmount),
        method: payMode,
        transactionId: payMode === "UPI" ? txnId : "",
        status: payStatus,
        paymentFor: payMonth,
      });

      alert("Payment updated successfully ✅");

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to update payment ❌"
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 shadow-inner">
      {/* 1. Fee Type Selection */}
      <div className="flex items-end gap-3 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Type</label>
          <select
            value={feeType}
            onChange={(e) => setFeeType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="NONE">None</option>
            <option value="MONTHLY">Monthly</option>
            <option value="ONE_TIME">One Time</option>
          </select>
        </div>
        <button
          onClick={handleSaveFeeType}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Save
        </button>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard title="Expected Fee" value={`₹${expectedFee.toLocaleString("en-IN")}`} />
        <SummaryCard title="Total Paid" value={`₹${totalPaid.toLocaleString("en-IN")}`} />
        <SummaryCard title="Pending Fee" value={`₹${pendingFee.toLocaleString("en-IN")}`} danger={pendingFee > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Add Fee Form */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow border dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-4 border-b pb-2">Add Fee</h3>
          <form onSubmit={handleSavePayment} className="space-y-4">
            {/* Amount Field */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Amount</label>
              <input
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                placeholder="₹0"
              />
            </div>

            {/* Month Field */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Month</label>
              <input
                type="month"
                required
                value={payMonth}
                onChange={(e) => setPayMonth(e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            {/* Mode Field */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Mode</label>
              <select
                value={payMode}
                onChange={(e) => {
                  setPayMode(e.target.value);
                  if (e.target.value !== "UPI") setTxnId("");
                }}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            {/* NAYA FIELD: Status Dropdown */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Status</label>
              <select
                value={payStatus}
                onChange={(e) => setPayStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            {/* Conditionally render Transaction ID input */}
            {payMode === "UPI" && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Transaction ID</label>
                <input
                  type="text"
                  required
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter UPI Txn ID"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition mt-2"
            >
              Save Payment
            </button>
          </form>
        </div>

        {/* 4. History Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 lg:col-span-2 overflow-hidden flex flex-col">
          <h3 className="font-semibold text-lg p-5 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            Payment History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Month</th>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Mode</th>
                  <th className="px-5 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {history.length > 0 ? (
                  history.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-5 py-3 text-sm">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-5 py-3 text-sm">
                        {record.paymentFor
                          ? new Date(record.paymentFor).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          }) : "-"}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                        ₹{Number(record.paidAmount || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3 text-sm">{record.method || "CASH"}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{record.transactionId || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                      No payment history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Existing SummaryCard (Unchanged exactly as you had it)
const SummaryCard = ({ title, value, danger }) => (
  <div className="bg-white p-5 rounded shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2
      className={`text-xl font-bold mt-1 ${danger ? "text-red-600" : ""
        }`}
    >
      {value}
    </h2>
  </div>
);

export default Payment;