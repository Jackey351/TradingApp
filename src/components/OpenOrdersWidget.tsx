import React from 'react';
import { useExchangeStore } from '../stores/exchangeStore';

const OpenOrdersWidget: React.FC = () => {
  const { orders } = useExchangeStore();
  const openOrders = orders.filter((o) => o.status === 'PENDING');

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Open Orders</h3>
      <div className="overflow-x-auto">
        <table className="trading-table">
          <thead className="trading-table-header">
            <tr>
              <th className="trading-table-header-cell">Symbol</th>
              <th className="trading-table-header-cell">Side</th>
              <th className="trading-table-header-cell">Type</th>
              <th className="trading-table-header-cell">Quantity</th>
              <th className="trading-table-header-cell">Price</th>
              <th className="trading-table-header-cell">Status</th>
              <th className="trading-table-header-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            {openOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No open orders
                </td>
              </tr>
            ) : (
              openOrders.map((order) => (
                <tr key={order.id} className="trading-table-row">
                  <td className="trading-table-cell">{order.symbol}</td>
                  <td className="trading-table-cell">{order.side}</td>
                  <td className="trading-table-cell">{order.type}</td>
                  <td className="trading-table-cell">{order.quantity}</td>
                  <td className="trading-table-cell">{order.price}</td>
                  <td className="trading-table-cell">{order.status}</td>
                  <td className="trading-table-cell">
                    {new Date(order.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenOrdersWidget;
