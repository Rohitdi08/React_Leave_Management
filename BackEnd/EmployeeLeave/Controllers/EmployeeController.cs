using EmployeeLeave.DB;
using EmployeeLeave.GlobalException;
using EmployeeLeave.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeLeave.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDBContext _dbcontext;

        public EmployeeController(EmployeeDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        // GET /api/employee
        [HttpGet]
        public IActionResult GetEmployees()
        {
            var employees = _dbcontext.Employees
                .Select(x => new EmployeeDto
                {
                    UserID = x.UserID,
                    EmployeeName = x.EmployeeName,
                    Email = x.Email,
                    MobileNo = x.MobileNo,
                    Department = x.Department,
                    Role = x.Role,
                    IsActive = x.IsActive,
                    CreatedDate = x.CreatedDate
                })
                .ToList();

            return Ok(employees);
        }

       
        
        // GET /api/employee/{id}
        [HttpGet("{id:int}")]
        public IActionResult GetEmployeeById(int id)
        {
            var employee = _dbcontext.Employees
                .Where(x => x.UserID == id)
                .Select(x => new EmployeeDto
                {
                    UserID = x.UserID,
                    EmployeeName = x.EmployeeName,
                    Email = x.Email,
                    MobileNo = x.MobileNo,
                    Department = x.Department,
                    Role = x.Role,
                    IsActive = x.IsActive,
                    CreatedDate = x.CreatedDate
                })
                .FirstOrDefault();

            if (employee == null)
            {
                throw new EmployeeNotFound($"Employee not found with id: {id}");
            }

            return Ok(employee);
        }
    }
}
