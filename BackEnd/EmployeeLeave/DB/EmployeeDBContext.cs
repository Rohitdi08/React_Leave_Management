using EmployeeLeave.Model;
using Microsoft.EntityFrameworkCore;

namespace EmployeeLeave.DB
{
    public class EmployeeDBContext:DbContext
    {
        public EmployeeDBContext(DbContextOptions<EmployeeDBContext> options) : base(options)
        {

        }

        public DbSet<EmployeeList> Employees { get; set; }
       
    }
}
