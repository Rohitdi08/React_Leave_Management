using System.ComponentModel.DataAnnotations;

namespace LeaveSer.Model
{
    public class ApplyLeave
    {
        [Required(ErrorMessage = "Leave type is required.")]
        [StringLength(50)]
        public string LeaveType { get; set; } = string.Empty;

        [Required(ErrorMessage = "From date is required.")]
        public DateTime FromDate { get; set; }

        [Required(ErrorMessage = "To date is required.")]
        public DateTime ToDate { get; set; }

        [Required(ErrorMessage = "Reason is required.")]
        [StringLength(500, MinimumLength = 3)]
        public string Reason { get; set; } = string.Empty;
    }
}
