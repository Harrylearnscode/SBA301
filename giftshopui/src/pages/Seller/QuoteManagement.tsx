export default function QuoteManager() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-6">Yêu cầu Báo Giá từ khách hàng</h2>
      <div className="space-y-6">
        {/* Một item yêu cầu */}
        <div className="border rounded-lg p-5 bg-gray-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-lg">Báo giá cho Công ty ABC</h4>
              <p className="text-xs text-gray-500 italic">Người gửi: Trần Thị B - 0909xxxxxx</p>
            </div>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded font-bold text-xs uppercase">Chờ xử lý</span>
          </div>
          
          <div className="bg-white p-4 rounded border mb-4">
            <h5 className="text-sm font-bold mb-3 uppercase text-gray-400">Điều chỉnh giá đề xuất:</h5>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="text-xs block mb-1">Thời hạn báo giá (validUntil):</label>
                  <input type="date" className="border w-full p-2 rounded text-sm" defaultValue="2026-03-06" />
               </div>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between items-center text-sm p-2 border-b">
                  <span>Vang Đỏ Chateau (ID: 12)</span>
                  <input type="number" className="border p-1 w-32 rounded text-right" placeholder="Giá đề xuất..." />
               </div>
               <div className="flex justify-between items-center text-sm p-2 border-b">
                  <span>Hộp Gỗ Sơn Mài (ID: 8)</span>
                  <input type="number" className="border p-1 w-32 rounded text-right" placeholder="Giá đề xuất..." />
               </div>
            </div>
          </div>

          <button className="bg-[#b30000] text-white px-6 py-2 rounded font-bold hover:bg-red-800 transition-colors">
            Gửi báo giá cho khách
          </button>
        </div>
      </div>
    </div>
  );
}