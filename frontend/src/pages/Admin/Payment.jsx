import React, { useEffect, useState } from "react";
import { getAllStudentPayments, setupPayment, updatePayment } from "../../api/payment.api";
import { Search, ChevronDown, CreditCard, History, IndianRupee, Wallet, Calendar, CheckCircle, Clock } from "lucide-react";

const Payment = () => {
  const [students, setStudents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [feeTypes, setFeeTypes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await getAllStudentPayments();
        const data = res.data.data || [];
        setStudents(data);

        const initialFeeTypes = {};
        data.forEach((student) => {
          initialFeeTypes[student.enrollmentId] = student.paymentType || "NONE";
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

  const getLatestPayment = (history) => {
    if (!history || history.length === 0) return null;
    return [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  };

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-8 h-8 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Ledger...</p>
    </div>
  );

  if (error) return <div className="p-10 text-rose-500 font-bold bg-rose-50 rounded-2xl">{error}</div>;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor enrollments and transaction cycles.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4F46E5] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search identity or enrollment..."
            className="industrial-input pl-12 w-full md:w-[320px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[60px_1fr_1.5fr_1fr_1fr_1fr] gap-4 font-black text-[10px] uppercase tracking-[2px] text-slate-400 px-8 py-6 bg-slate-50/50 border-b border-slate-100">
          <div></div>
          <div>Enrollment ID</div>
          <div>Student Name</div>
          <div>Status</div>
          <div>Projected</div>
          <div>Cycle Type</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {filteredStudents.map((student) => {
            const latest = getLatestPayment(student.history);
            const status = latest?.status || "PENDING";
            const amount = latest?.expectedAmount || student.coursePrice || 0;
            const isExpanded = expandedId === student.enrollmentId;

            return (
              <div key={student.enrollmentId} className="group">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : student.enrollmentId)}
                  className={`grid grid-cols-[40px_1fr_1fr] lg:grid-cols-[60px_1fr_1.5fr_1fr_1fr_1fr] items-center gap-4 px-8 py-6 hover:bg-slate-50/80 cursor-pointer transition-all ${isExpanded ? 'bg-slate-50/50' : ''}`}
                >
                  <div className="flex justify-center">
                    <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isExpanded ? "rotate-180 text-[#4F46E5]" : ""}`} />
                  </div>

                  <div className="font-bold text-slate-500 text-sm">{student.enrollmentNo}</div>
                  <div className="font-black text-slate-900 tracking-tight">{student.name}</div>

                  <div>
                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                      {status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-700">₹{amount.toLocaleString("en-IN")}</div>

                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {student.paymentType?.replace("_", " ") || "UNSET"}
                  </div>
                </div>

                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <ExpandedSection student={student} currentFeeType={feeTypes[student.enrollmentId] || "NONE"} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ExpandedSection = ({ student, currentFeeType }) => {
  const [feeType, setFeeType] = useState(currentFeeType);
  const [payAmount, setPayAmount] = useState("");
  const [payMonth, setPayMonth] = useState("");
  const [payMode, setPayMode] = useState("CASH");
  const [txnId, setTxnId] = useState("");
  const [payStatus, setPayStatus] = useState("PENDING");

  const history = student.history || [];
  const expectedFee = student.coursePrice || 0;
  const totalPaid = history.reduce((sum, record) => sum + (Number(record.paidAmount) || 0), 0);
  const pendingFee = expectedFee - totalPaid;

  const handleSaveFeeType = async () => {
    if (feeType === "NONE") { alert("Select type"); return; }
    try {
      await setupPayment({ enrollmentId: student.enrollmentId, paymentType: feeType });
      alert("Cycle initialized successfully ✅");
    } catch (error) { alert("Initialization failed ❌"); }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    try {
      if (!student.history || student.history.length === 0) {
        alert("Initialize cycle first!"); return;
      }
      const latestPayment = [...student.history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      await updatePayment(latestPayment._id, {
        paidAmount: Number(payAmount),
        method: payMode,
        transactionId: payMode === "UPI" ? txnId : "",
        status: payStatus,
        paymentFor: payMonth,
      });
      alert("Payment Logged Successfully ✅");
    } catch (error) { alert("Logging Failed ❌"); }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] border-y border-slate-100 shadow-inner">
      {/* 1. Cycle Definition */}
      <div className="flex flex-col sm:flex-row items-end gap-4 mb-8 p-6 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Payment Strategy</label>
          <select value={feeType} onChange={(e) => setFeeType(e.target.value)} className="industrial-input appearance-none">
            <option value="NONE">Not Defined</option>
            <option value="MONTHLY">Monthly Installments</option>
            <option value="ONE_TIME">Full Lump Sum</option>
          </select>
        </div>
        <button onClick={handleSaveFeeType} className="bg-slate-900 hover:bg-[#4F46E5] text-white font-black text-[10px] uppercase tracking-[2px] px-8 py-4 rounded-2xl transition-all shadow-lg active:scale-95 w-full sm:w-auto">
          Set Cycle
        </button>
      </div>

      {/* 2. Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Platform Quota" value={`₹${expectedFee.toLocaleString("en-IN")}`} icon={IndianRupee} color="indigo" />
        <SummaryCard title="Credit Received" value={`₹${totalPaid.toLocaleString("en-IN")}`} icon={CheckCircle} color="emerald" />
        <SummaryCard title="Outstanding" value={`₹${pendingFee.toLocaleString("en-IN")}`} icon={Clock} color={pendingFee > 0 ? "rose" : "slate"} danger={pendingFee > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* 3. Terminal Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <CreditCard size={20} className="text-[#4F46E5]" />
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Entry Terminal</h3>
          </div>
          <form onSubmit={handleSavePayment} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Amount</label>
              <input type="number" required value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="industrial-input" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Billing Month</label>
                <input type="month" required value={payMonth} onChange={(e) => setPayMonth(e.target.value)} className="industrial-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Status</label>
                <select value={payStatus} onChange={(e) => setPayStatus(e.target.value)} className="industrial-input">
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Method</label>
              <select value={payMode} onChange={(e) => { setPayMode(e.target.value); if (e.target.value !== "UPI") setTxnId(""); }} className="industrial-input">
                <option value="CASH">Liquid Cash</option>
                <option value="UPI">Digital (UPI)</option>
              </select>
            </div>
            {payMode === "UPI" && (
              <div className="space-y-2 animate-in zoom-in-95">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Transaction Ref</label>
                <input type="text" required value={txnId} onChange={(e) => setTxnId(e.target.value)} className="industrial-input" placeholder="TXN-998..." />
              </div>
            )}
            <button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-[10px] uppercase tracking-[2px] py-4 rounded-2xl shadow-md transition-all mt-4">
              Commit Transaction
            </button>
          </form>
        </div>

        {/* 4. History Vault */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <History size={20} className="text-slate-400" />
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Transaction Vault</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Stamp</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Cycle</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Credit</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {history.length > 0 ? (
                  history.map((record, index) => (
                    <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-900 uppercase">
                        {record.paymentFor ? new Date(record.paymentFor).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }) : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-emerald-600">₹{Number(record.paidAmount).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4 text-[10px] font-bold text-slate-400 text-right">{record.transactionId || record.method}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-300 font-bold italic text-sm">No historical data found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon: Icon, color, danger }) => {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    slate: "text-slate-600 bg-slate-50"
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-5">
      <div className={`p-3 rounded-2xl ${colors[color]}`}><Icon size={24} /></div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h2 className={`text-xl font-black mt-1 ${danger ? "text-rose-600" : "text-slate-900"}`}>{value}</h2>
      </div>
    </div>
  );
};

export default Payment;