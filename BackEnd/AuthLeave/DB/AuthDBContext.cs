using AuthLeave.Model;
using Microsoft.EntityFrameworkCore;
namespace AuthLeave.DB
{
    public class AuthDBContext :DbContext
    {
        public AuthDBContext(DbContextOptions<AuthDBContext> options) : base(options) { 
        
        }

        public DbSet<EmployeeList> Employees { get; set; }
        public DbSet<Refresh> Refresh { get; set; }
    }
}
