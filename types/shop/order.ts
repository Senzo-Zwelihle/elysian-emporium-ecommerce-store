export const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-700 ";
    case "Processing":
      return "bg-blue-700 ";
    case "Shipped":
      return "bg-purple-700 ";
    case "Completed":
      return "bg-green-700 ";
    case "Pending":
      return "bg-yellow-700 ";
    case "CashOnDelivery":
      return "bg-gray-700 ";
    default:
      return "bg-gray-700 ";
  }
};
