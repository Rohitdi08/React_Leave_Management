using LeaveSer.Model;
using Microsoft.EntityFrameworkCore;

namespace LeaveSer.DB
{
    public class LeaveDBContext : DbContext
    {
        public LeaveDBContext(DbContextOptions<LeaveDBContext> options) : base(options)
        {

        }

        public DbSet<LeaveRequest> Leaves { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LeaveRequest>().ToTable("Leave");
            modelBuilder.Entity<LeaveRequest>().HasIndex(x => x.EmployeeId);
        }
    }
}
