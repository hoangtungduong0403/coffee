import { useNavigate } from "react-router-dom";
import CustomerItem from "../components/CustomerItem";
import SearchBar from "../components/SearchBar";
import { useCustomers } from "../hooks/useCustomers";

export default function CustomerList() {
  const { customers, search } = useCustomers();
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gray-100">
      <SearchBar onSearch={search} />

      {customers.length > 0 ? (
        <div className="mt-4 space-y-3">
          {customers.map((item, index) => (
            <CustomerItem
              key={item?.id || index}
              customer={item}
              onClick={() =>
                navigate(`/customer/${item.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-4">No customers found</p>
      )}
    </div>
  );
}