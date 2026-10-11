using System.ComponentModel.DataAnnotations;

namespace LeaveSer.Model
{
    public class LeaveRequest
    {
        [Key]
        public int LeaveId { get; set; }

        // UserID from the Employees table (Auth1), taken from the JWT
        public int EmployeeId { get; set; }

        [Required]
        [StringLength(50)]
        public string LeaveType { get; set; } = string.Empty;

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = LeaveStatus.Pending;

        [StringLength(500)]
        public string? AdminRemark { get; set; }

        public DateTime AppliedDate { get; set; }

        public DateTime? ActionDate { get; set; }
    }

    public static class LeaveStatus
    {
        public const string Pending = "Pending";
        public const string Approved = "Approved";
        public const string Rejected = "Rejected";
    }
}
