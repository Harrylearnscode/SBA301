export default function OrderManager() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-6">Quản lý Đơn hàng</h2>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <th className="p-4 border-b">Order ID</th>
            <th className="p-4 border-b">Khách hàng</th>
            <th className="p-4 border-b">Tổng tiền</th>
            <th className="p-4 border-b">Thanh toán</th>
            <th className="p-4 border-b">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border-b font-bold">#ORD-1002</td>
            <td className="p-4 border-b">Nguyễn Văn A</td>
            <td className="p-4 border-b">2,500,000đ</td>
            <td className="p-4 border-b">
              <select className="border rounded px-2 py-1 bg-gray-50">
                <option>Chờ thanh toán</option>
                <option selected>Đã thanh toán</option>
                <option>Đã hoàn tiền</option>
              </select>
            </td>
            <td className="p-4 border-b">
              <select className="border rounded px-2 py-1 bg-red-50 text-red-700 font-medium">
                <option>Đang xử lý</option>
                <option>Đang giao</option>
                <option selected>Hoàn thành</option>
                <option>Đã hủy</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}