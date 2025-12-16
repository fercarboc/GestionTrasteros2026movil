import React, { useEffect, useState } from 'react';
import { invoicesService } from '../services/invoicesService';
import { Invoice } from '../types';
import { Download, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
        try {
            const data = await invoicesService.getMyInvoices();
            setInvoices(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Historial de Facturas</h2>
      
      {loading ? (
         <div className="space-y-2">
            {[1,2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"/>)}
         </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {invoices.length === 0 ? (
             <div className="p-8 text-center text-sm text-gray-500">No hay facturas disponibles.</div>
          ) : (
             invoices.map((inv) => (
                <div key={inv.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{inv.number}</p>
                        <p className="text-xs text-gray-500">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  
                  {/* VeriFactu Status & Amount */}
                  <div className="flex-1 flex flex-col items-end w-full sm:w-auto">
                    <p className="text-sm font-bold text-gray-900 mb-1">{inv.amount ? inv.amount.toFixed(2) : '0.00'}€</p>
                    
                    {/* VeriFactu Badge */}
                    <div className="flex items-center space-x-2">
                        {inv.verifactu_status === 'submitted_ok' ? (
                          <div className="flex items-center px-2 py-0.5 bg-green-50 rounded border border-green-100" title="Enviado a Hacienda">
                            <CheckCircle2 size={12} className="text-green-600 mr-1"/>
                            <span className="text-[10px] font-bold text-green-700">AEAT OK</span>
                          </div>
                        ) : (
                          <div className="flex items-center px-2 py-0.5 bg-orange-50 rounded border border-orange-100" title="Pendiente de envío">
                            <Clock size={12} className="text-orange-600 mr-1"/>
                            <span className="text-[10px] font-bold text-orange-700">Pendiente AEAT</span>
                          </div>
                        )}
                        {inv.pdf_url && (
                          <a href={inv.pdf_url} className="text-xs text-primary-600 flex items-center hover:underline ml-2">
                            <Download size={12} className="mr-1"/> PDF
                          </a>
                        )}
                    </div>
                    
                    {/* Hash Display */}
                    {inv.verifactu_hash && (
                      <div className="mt-1 max-w-[150px] sm:max-w-[200px] text-right">
                        <p className="text-[9px] text-gray-400 font-mono truncate" title={inv.verifactu_hash}>
                          Huella: {inv.verifactu_hash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
             ))
          )}
        </div>
      )}
    </div>
  );
}