import type { User } from "../types";
import type { EmployeeDto } from "./dto";
import { apiFetch } from "./http";
import { toUser } from "./mappers";

/* EmployeeLeave service (http://localhost:5056). Any logged-in user may call it. */

/* GET /api/employee */
export async function getEmployees(): Promise<User[]> {
    const employees = await apiFetch<EmployeeDto[]>("/api/employee");
    return employees.map(toUser);
}

/* GET /api/employee/{id} -> 404 when not found. */
export async function getEmployeeById(id: number): Promise<User> {
    return toUser(await apiFetch<EmployeeDto>(`/api/employee/${id}`));
}
