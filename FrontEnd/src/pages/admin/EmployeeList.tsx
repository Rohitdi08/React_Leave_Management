import { useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import type { User } from "../../types";

function EmployeeList({ employees, loading }: { employees: User[]; loading: boolean }) {
    const [search, setSearch] = useState("");

    const term = search.trim().toLowerCase();
    const filtered = employees.filter(
        e =>
            !term ||
            e.employeeName.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term) ||
            e.department.toLowerCase().includes(term)
    );

    return (
        <div className="card">
            <div className="card-header">
                <h2>Registered Employees</h2>
                <input
                    className="search"
                    type="search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search name, email, department"
                    aria-label="Search employees"
                />
            </div>

            {loading && employees.length === 0 ? (
                <p className="empty">Loading employees...</p>
            ) : filtered.length === 0 ? (
                <p className="empty">No employees found.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Department</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(emp => (
                                <tr key={emp.userId}>
                                    <td>{emp.userId}</td>
                                    <td>{emp.employeeName}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.mobileNo}</td>
                                    <td>{emp.department}</td>
                                    <td><StatusBadge status={emp.isActive ? "Active" : "Inactive"} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default EmployeeList;
