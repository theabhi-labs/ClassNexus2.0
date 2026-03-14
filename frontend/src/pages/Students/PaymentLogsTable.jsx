import React from 'react';

const PaymentLogsTable = ({ payments }) => {
  // Debugging: Isse aap console mein dekh payenge ki table ko mil kya raha hai
  // console.log("Received Payments in Table:", payments);

  // Safety check: Agar payments undefined hai ya array nahi hai
  const paymentList = Array.isArray(payments) ? payments : [];

  if (paymentList.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          📑
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px]">No transaction history found</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/60 shadow-sm rounded-[2.5rem] p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-3">
          <div className="w-8 h-[2px] bg-emerald-500"></div> Payment Logs
        </h3>
        <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">
          {paymentList.length} Transactions
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-4">
              <th className="pb-2 px-4">Paid Date</th>
              <th className="pb-2 px-4">For Month</th>
              <th className="pb-2 px-4">Method</th>
              <th className="pb-2 px-4">TXN ID / Status</th>
              <th className="pb-2 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {paymentList.map((log) => (
              <tr key={log._id} className="group transition-all">
                
                {/* 1. Paid Date (from paymentDate) */}
                <td className="py-5 px-4 bg-slate-50 group-hover:bg-slate-100 rounded-l-2xl text-[13px] font-bold text-slate-600 transition-colors">
                  {log.paymentDate 
                    ? new Date(log.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : '—'}
                </td>

                {/* 2. For Month (from paymentFor) */}
                <td className="py-5 px-4 bg-slate-50 group-hover:bg-slate-100 text-[13px] font-black text-indigo-600 transition-colors uppercase">
                  {log.paymentFor 
                    ? new Date(log.paymentFor).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) 
                    : 'One-Time'}
                </td>

                {/* 3. Method (CASH/UPI) */}
                <td className="py-5 px-4 bg-slate-50 group-hover:bg-slate-100 text-[10px] font-black transition-colors">
                  <span className={`px-3 py-1 rounded-full border shadow-sm ${
                    log.method === 'CASH' 
                    ? 'bg-amber-50 border-amber-100 text-amber-600' 
                    : 'bg-white border-slate-200 text-slate-500'
                  }`}>
                    {log.method || 'N/A'}
                  </span>
                </td>

                {/* 4. TXN Details (Uses transactionId or Status) */}
                <td className="py-5 px-4 bg-slate-50 group-hover:bg-slate-100 text-[11px] font-medium text-slate-400 font-mono transition-colors">
                  {log.method === 'UPI' && log.transactionId ? (
                    log.transactionId
                  ) : (
                    <span className={`text-[10px] font-sans font-bold ${log.status === 'PAID' ? 'text-emerald-500' : 'text-rose-400'}`}>
                      ● {log.status}
                    </span>
                  )}
                </td>

                {/* 5. Amount (paidAmount) */}
                <td className="py-5 px-4 bg-slate-50 group-hover:bg-slate-100 rounded-r-2xl text-right font-black text-slate-900 transition-colors text-sm">
                  ₹{log.paidAmount?.toLocaleString('en-IN')}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentLogsTable;