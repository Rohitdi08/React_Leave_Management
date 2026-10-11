using Microsoft.EntityFrameworkCore;
using AuthLeave.Model;
namespace Auth1.DB
{
    public class AuthDBContext :DbContext
    {
        public AuthDBContext(DbContextOptions<AuthDBContext> options) : base(options)
        {

        }

     public DbSet<EmployeeList> Employees { get; set; }
     public DbSet<Refresh> Refreshes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Existing table in the database is named "Refresh"
            modelBuilder.Entity<Refresh>().ToTable("Refresh");
        }
    }
}
